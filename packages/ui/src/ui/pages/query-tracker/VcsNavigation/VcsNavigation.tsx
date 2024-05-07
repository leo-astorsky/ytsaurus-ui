import React, {FC, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {checkExistingTokens} from '../module/repoNavigation/actions';
import {VcsNavigationHeader} from './VcsNavigationHeader';
import {VcsItemsList} from './VcsItemsList';
import './VcsNavigation.scss';
import cn from 'bem-cn-lite';

const block = cn('vsc-navigation');

export const VcsNavigation: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkExistingTokens());
    }, [dispatch]);

    return (
        <div className={block()}>
            <VcsNavigationHeader />
            <VcsItemsList />
        </div>
    );
};
