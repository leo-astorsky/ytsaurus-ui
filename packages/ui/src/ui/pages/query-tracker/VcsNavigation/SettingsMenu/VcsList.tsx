import React, {FC, useCallback} from 'react';
import {VcsListItem} from './VcsListItem';
import cn from 'bem-cn-lite';
import {VcsType} from '../../module/repoNavigation/repoNavigationSlice';
import './VcsList.scss';
import {useDispatch} from 'react-redux';
import {removeToken} from '../../module/repoNavigation/actions';

const block = cn('vcs-list');

type Props = {
    tokens: VcsType[];
};

export const VcsList: FC<Props> = ({tokens}) => {
    const dispatch = useDispatch();

    const handleRemoveToken = useCallback(
        (vcs: VcsType) => {
            return dispatch(removeToken(vcs));
        },
        [dispatch],
    );

    if (!tokens.length) return null;

    return (
        <div className={block()}>
            <div>
                {tokens.map((name) => (
                    <VcsListItem key={name} name={name} onClick={handleRemoveToken} />
                ))}
            </div>
        </div>
    );
};
