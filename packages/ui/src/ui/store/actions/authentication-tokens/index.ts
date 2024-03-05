import type {ThunkAction} from 'redux-thunk';
import type {RootState} from '../../reducers';
import type {AuthenticationTokensListAction} from '../../reducers/authentication-tokens/tokens';
import type {AuthenticationTokensCredentialsAction} from '../../reducers/authentication-tokens/credentials';
import {YTApiId, ytApiV4Id} from '../../../rum/rum-wrap-api';
import {getQueryTrackerCluster} from '../../../config';
import {getClusterConfigByName, getClusterProxy} from '../../selectors/global';
import {
    AUTHENTICATION_TOKENS_CREDENTIALS_CLEAR,
    AUTHENTICATION_TOKENS_CREDENTIALS_SET,
    AUTHENTICATION_TOKENS_FILTER_CLEAR,
    AUTHENTICATION_TOKENS_FILTER_SET,
    AUTHENTICATION_TOKENS_LIST,
    AUTHENTICATION_TOKENS_MODALS_CLOSE,
    AUTHENTICATION_TOKENS_MODALS_OPEN,
} from '../../../constants/authentication-tokens';
import {AuthenticationTokensModalAction} from '../../reducers/authentication-tokens/modal';
import {AuthenticationTokensFilterAction} from '../../reducers/authentication-tokens/filter';

function getQTApiSetup(): {proxy?: string} {
    const QT_CLUSTER = getQueryTrackerCluster();
    if (QT_CLUSTER) {
        const cluster = getClusterConfigByName(QT_CLUSTER);
        if (cluster) {
            return {
                proxy: getClusterProxy(cluster),
            };
        }
    }
    return {};
}

type Credentials = {
    password_sha256: string;
    user: string;
};

async function sha256(str: string) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));

    return [...new Uint8Array(buf)].map((x) => ('00' + x.toString(16)).slice(-2)).join('');
}

export const filterAuthenticationTokens = (data: {
    token: string;
}): ThunkAction<Promise<unknown>, RootState, unknown, AuthenticationTokensFilterAction> => {
    return (dispatch) => {
        if (data.token) {
            return sha256(data.token)
                .then((hash) => {
                    dispatch({type: AUTHENTICATION_TOKENS_FILTER_SET, data: {value: hash}});

                    return;
                })
                .catch(console.error);
        }

        dispatch({type: AUTHENTICATION_TOKENS_FILTER_CLEAR});

        return Promise.resolve();
    };
};

export const authenticationTokensSetCredentials = (data: {
    password: string;
}): ThunkAction<
    Promise<Credentials>,
    RootState,
    unknown,
    AuthenticationTokensCredentialsAction
> => {
    return (dispatch, getState) => {
        const state = getState();
        const user = state.global.login;

        return sha256(data.password).then((password_sha256) => {
            const credentials = {password_sha256, user};

            dispatch({type: AUTHENTICATION_TOKENS_CREDENTIALS_SET, data: credentials});

            return credentials;
        });
    };
};

export const authenticationTokensClearCredentials = (): ThunkAction<
    unknown,
    RootState,
    unknown,
    AuthenticationTokensCredentialsAction
> => {
    return (dispatch) => {
        dispatch({type: AUTHENTICATION_TOKENS_CREDENTIALS_CLEAR});
    };
};

export const authenticationTokensGetList = (
    credentials: Credentials,
): ThunkAction<Promise<unknown>, RootState, unknown, AuthenticationTokensListAction> => {
    return (dispatch) => {
        dispatch({type: AUTHENTICATION_TOKENS_LIST.REQUEST});

        return ytApiV4Id
            .listUserTokens(YTApiId.listUserTokens, {
                parameters: {
                    ...credentials,
                    with_metadata: true,
                },
                setup: getQTApiSetup(),
            })
            .then((data) => {
                dispatch({type: AUTHENTICATION_TOKENS_LIST.SUCCESS, data: {data}});
            })
            .catch((error) => {
                dispatch({type: AUTHENTICATION_TOKENS_LIST.FAILURE, data: {error}});

                throw error;
            });
    };
};

export const authenticationTokensCreateToken = ({
    description,
    credentials,
}: {
    description: string;
    credentials: Credentials;
}): ThunkAction<Promise<string>, RootState, unknown, AuthenticationTokensListAction> => {
    return () => {
        return ytApiV4Id.issueToken(YTApiId.issueToken, {
            parameters: {
                description,
                ...credentials,
            },
            setup: getQTApiSetup(),
        });
    };
};

export const authenticationTokensRevokeToken = ({
    credentials,
    token_sha256,
}: {
    token_sha256: string;
    credentials: Credentials;
}): ThunkAction<Promise<unknown>, RootState, unknown, AuthenticationTokensListAction> => {
    return () => {
        return ytApiV4Id.revokeToken(YTApiId.issueToken, {
            parameters: {
                token_sha256,
                ...credentials,
            },
            setup: getQTApiSetup(),
        });
    };
};

export const openAuthenticationTokensModal = (): ThunkAction<
    unknown,
    RootState,
    unknown,
    AuthenticationTokensModalAction
> => {
    return (dispatch) => {
        dispatch({type: AUTHENTICATION_TOKENS_MODALS_OPEN});
    };
};

export const closeAuthenticationTokensModal = (): ThunkAction<
    unknown,
    RootState,
    unknown,
    AuthenticationTokensModalAction
> => {
    return (dispatch) => {
        dispatch({type: AUTHENTICATION_TOKENS_MODALS_CLOSE});
    };
};

export const clearAuthenticationTokensFilter = (): ThunkAction<
    unknown,
    RootState,
    unknown,
    AuthenticationTokensFilterAction
> => {
    return (dispatch) => {
        dispatch({type: AUTHENTICATION_TOKENS_FILTER_CLEAR});
    };
};
