import cn from 'bem-cn-lite';
import moment from 'moment';
import * as React from 'react';
import {FC, useMemo, useState} from 'react';
import {Alert, Button, Dialog, TextInput} from '@gravity-ui/uikit';
import {FormApi} from '@gravity-ui/dialog-fields';
import truncate from 'lodash/truncate';
import Modal from '../../components/Modal/Modal';
import {YTDFDialog, makeErrorFields} from '../../components/Dialog/Dialog';
import {
    authenticationTokensClearCredentials,
    authenticationTokensCreateToken,
    authenticationTokensGetList,
    authenticationTokensRevokeToken,
    authenticationTokensSetCredentials,
    clearAuthenticationTokensFilter,
    closeAuthenticationTokensModal,
    filterAuthenticationTokens,
} from '../../store/actions/authentication-tokens';
import {useThunkDispatch} from '../../store/thunkDispatch';
import {useDispatch, useSelector} from 'react-redux';
import {
    AuthenticationToken,
    getAuthenticationTokens,
    getAuthenticationTokensCredentials,
    isAuthenticationTokensModalOpened,
} from '../../store/selectors/authentication-tokens';
import Icon from '../../components/Icon/Icon';
import {YTError} from '../../../@types/types';
import ClipboardButton from '../../components/ClipboardButton/ClipboardButton';
import DataTableYT from '../../components/DataTableYT/DataTableYT';

import './AuthenticationTokensModal.scss';

const block = cn('authentication-tokens');

const AuthenticationGenerateTokenFormSection: FC<{onClose: () => void}> = ({onClose}) => {
    type FormData = {description: string};
    const credentials = useSelector(getAuthenticationTokensCredentials);
    const dispatch = useThunkDispatch();
    const [error, setError] = useState<YTError>();
    const [token, setToken] = useState<string>();

    const handleSubmit = (form: FormApi<FormData>) => {
        const {description} = form.getState().values;

        setError(undefined);

        return dispatch(
            authenticationTokensCreateToken({
                description,
                credentials,
            }),
        )
            .then((token) => {
                setToken(token);

                return dispatch(authenticationTokensGetList(credentials))
                    .then(() => undefined)
                    .catch(() => undefined);
            })
            .catch((error) => {
                setError(error);

                return Promise.reject(error);
            });
    };

    if (token) {
        return (
            <div className={block('tokens')}>
                <h2>Copy token value</h2>
                <Alert
                    theme="warning"
                    message="Please save the token value. It is impossible to get the token value after closing the dialog"
                />
                <br />
                <Alert
                    message={token}
                    layout="horizontal"
                    actions={<ClipboardButton text={token} />}
                />
                <div className={block('tokens-action')}>
                    <Button
                        size="l"
                        view="action"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <YTDFDialog<FormData>
            headerProps={{
                title: 'Generate token',
            }}
            pristineSubmittable
            modal={false}
            visible={true}
            initialValues={{}}
            onAdd={handleSubmit}
            fields={[
                {
                    name: 'description',
                    type: 'textarea',
                    caption: 'Description',
                },
                ...makeErrorFields([error]),
            ]}
            footerProps={{
                propsButtonCancel: {
                    onClick: () => {
                        onClose();
                    },
                },
            }}
        />
    );
};

const AuthenticationPasswordSection: FC<{onSuccess: () => void}> = ({onSuccess}) => {
    const [error, setError] = useState<YTError>();
    type FormData = {password: string};
    const dispatch = useThunkDispatch();
    const handleSubmit = async (form: FormApi<FormData>) => {
        const values = form.getState().values;

        setError(undefined);

        await dispatch(authenticationTokensSetCredentials(values)).then((credentials) => {
            return dispatch(authenticationTokensGetList(credentials))
                .then(() => {
                    onSuccess();
                })
                .catch((error) => {
                    dispatch(authenticationTokensClearCredentials());
                    setError(error);
                });
        });
    };

    return (
        <YTDFDialog<FormData>
            headerProps={{
                title: 'Authentication',
            }}
            pristineSubmittable
            modal={false}
            visible={true}
            initialValues={{}}
            onAdd={handleSubmit}
            fields={[
                {
                    name: 'error-block',
                    type: 'block',
                    extras: {
                        children: (
                            <Alert message="To access tokens management, you need enter your password" />
                        ),
                    },
                },
                {
                    name: 'password',
                    type: 'text',
                    required: true,
                    caption: 'Password',
                    extras: () => ({type: 'password'}),
                },
                ...makeErrorFields([error]),
            ]}
            footerProps={{
                propsButtonCancel: {
                    onClick: () => {
                        dispatch(closeAuthenticationTokensModal());
                    },
                },
            }}
        />
    );
};

const RevokeToken = (props: {handleClickRemoveToken: (index: number) => void; index: number}) => {
    const [visible, setVisible] = useState(false);

    const handleClick = () => {
        setVisible(true);
    };

    const handleConfirm = () => {
        props.handleClickRemoveToken(props.index);

        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Button size={'s'} onClick={handleClick}>
                <Icon awesome={'trash-bin'} />
            </Button>
            <Modal
                content="Are you sure you want to revoke the token? This action CANNOT be undone."
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                onOutsideClick={handleCancel}
                visible={visible}
            />
        </>
    );
};

const AuthenticationTokensSection: FC<{
    onClickGenerateTokenButton: () => void;
    onSuccessRemove: () => void;
}> = ({onSuccessRemove, onClickGenerateTokenButton}) => {
    const dispatch = useThunkDispatch();
    const tokens = useSelector(getAuthenticationTokens)!;
    const credentials = useSelector(getAuthenticationTokensCredentials);

    const handleClickRemoveToken = (index: number) => {
        dispatch(
            authenticationTokensRevokeToken({
                credentials,
                token_sha256: tokens![index].tokenHash,
            }),
        ).then(() => {
            return dispatch(authenticationTokensGetList(credentials)).finally(() =>
                onSuccessRemove(),
            );
        });
    };

    return (
        <div className={block('tokens')}>
            <h2>Authentication Tokens</h2>
            <div className={block('generate-token-button')}>
                <Button size="l" view="action" onClick={() => onClickGenerateTokenButton()}>
                    Generate token
                </Button>
            </div>
            <div className={block('filters')}>
                <TextInput
                    hasClear
                    name="filter"
                    placeholder="Filtering by token"
                    onChange={(event) => {
                        dispatch(filterAuthenticationTokens({token: event.currentTarget.value}));
                    }}
                />
            </div>
            <DataTableYT<AuthenticationToken>
                loaded
                useThemeYT
                data={tokens}
                noItemsText="No tokens found"
                rowClassName={() => block('table-row')}
                columns={[
                    {
                        name: 'tokenPrefix',
                        header: 'Token',
                        width: 110,
                        className: block('table-cell'),
                    },
                    {
                        name: 'tokenHash',
                        header: 'Token Hash',
                        width: 110,
                        className: block('table-cell', {name: 'hash'}),
                        render: ({value}) => {
                            return truncate(String(value), {length: 12});
                        },
                    },
                    {
                        name: 'description',
                        header: 'Description',
                        width: 320,
                        className: block('table-cell', {name: 'description'}),
                    },
                    {
                        name: 'creationTime',
                        header: 'Issued At',
                        width: 160,
                        className: block('table-cell'),
                        render: (value) => {
                            return value.value
                                ? moment(value.value).format('DD/MM/YYYY hh:mm:ss')
                                : '';
                        },
                    },
                    {
                        name: '',
                        width: 30,
                        className: block('table-cell'),
                        render: ({index}) => (
                            <RevokeToken
                                index={index}
                                handleClickRemoveToken={handleClickRemoveToken}
                            />
                        ),
                    },
                ]}
                settings={{
                    displayIndices: false,
                    sortable: false,
                    highlightRows: false,
                    stripedRows: false,
                    disableSortReset: true,
                }}
            />
        </div>
    );
};

enum ViewSection {
    default,
    tokens,
    generate,
}

const useViewSectionState = () => {
    const [section, setSection] = useState<ViewSection>(ViewSection.default);

    return {section, setSection};
};

export const AuthenticationTokensModal = () => {
    const {section, setSection} = useViewSectionState();
    const open = useSelector(isAuthenticationTokensModalOpened)!;
    const dispatch = useDispatch();

    const content = useMemo(() => {
        switch (section) {
            case ViewSection.default:
                return (
                    <AuthenticationPasswordSection
                        onSuccess={() => setSection(ViewSection.tokens)}
                    />
                );
            case ViewSection.tokens:
                return (
                    <AuthenticationTokensSection
                        onSuccessRemove={() => setSection(ViewSection.tokens)}
                        onClickGenerateTokenButton={() => setSection(ViewSection.generate)}
                    />
                );
            case ViewSection.generate:
                return (
                    <AuthenticationGenerateTokenFormSection
                        onClose={() => setSection(ViewSection.tokens)}
                    />
                );
            default:
                return null;
        }
    }, [section]);

    const handleCloseModal = () => {
        dispatch(closeAuthenticationTokensModal());
        dispatch(authenticationTokensClearCredentials());
        dispatch(clearAuthenticationTokensFilter());

        setSection(ViewSection.default);
    };

    return (
        <Dialog open={open} hasCloseButton={true} onClose={handleCloseModal}>
            <div className={block('content')}>{content}</div>
        </Dialog>
    );
};
