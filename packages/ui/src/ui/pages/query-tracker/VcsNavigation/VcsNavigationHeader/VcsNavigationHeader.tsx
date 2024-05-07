import React, {FC, useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectActiveTokens,
    selectBranch,
    selectBranches,
    selectRepositories,
    selectRepository,
    selectVcs,
} from '../../module/repoNavigation/selectors';
import {SelectSingle} from '../../../../components/Select/Select';
import {VcsType} from '../../module/repoNavigation/repoNavigationSlice';
import {
    changeCurrentBranch,
    changeCurrentRepository,
    getVcsRepositories,
} from '../../module/repoNavigation/actions';
import './VcsNavigationHeader.scss';
import cn from 'bem-cn-lite';
import CircleQuestionIcon from '@gravity-ui/icons/svgs/circle-question.svg';
import {Flex, Icon, Tooltip} from '@gravity-ui/uikit';

const block = cn('vcs-navigation-header');

export const VcsNavigationHeader: FC = () => {
    const dispatch = useDispatch();
    const tokens = useSelector(selectActiveTokens);
    const currentVcs = useSelector(selectVcs);
    const repositories = useSelector(selectRepositories);
    const repository = useSelector(selectRepository);
    const branch = useSelector(selectBranch);
    const branches = useSelector(selectBranches);

    const handleChangeVcs = useCallback(
        (value?: string) => {
            if (value) dispatch(getVcsRepositories(value as VcsType));
        },
        [dispatch],
    );

    const handleChangeRepository = useCallback(
        (currentRepository?: string) => {
            if (currentRepository) dispatch(changeCurrentRepository(currentRepository));
        },
        [dispatch],
    );

    const handleChangeBranch = useCallback(
        (currentBranch?: string) => {
            if (currentBranch) dispatch(changeCurrentBranch(currentBranch));
        },
        [dispatch],
    );

    const selectActiveVcsItems = useMemo(() => {
        return tokens.map((value) => ({value}));
    }, [tokens]);

    const selectRepoItems = useMemo(() => {
        return Object.keys(repositories).map((key) => ({value: key}));
    }, [repositories]);

    const selectBranchItems = useMemo(() => {
        return branches.map((i) => ({value: i}));
    }, [branches]);

    return (
        <div className={block()}>
            <Flex alignItems="center" gap={2}>
                <SelectSingle
                    items={selectActiveVcsItems}
                    value={currentVcs}
                    onChange={handleChangeVcs}
                    placeholder="Select VCS type"
                    hideClear
                />
                <Tooltip content="You can add VCS tokens in the section Settings -> VCS">
                    <Icon data={CircleQuestionIcon} size={16} />
                </Tooltip>
            </Flex>
            <div className={block('top-menu')}>
                <SelectSingle
                    items={selectRepoItems}
                    value={repository}
                    onChange={handleChangeRepository}
                    disabled={!selectRepoItems.length}
                    placeholder="Select repository"
                    hideClear
                />
                <SelectSingle
                    items={selectBranchItems}
                    value={branch}
                    onChange={handleChangeBranch}
                    disabled={!repository}
                    placeholder="Select branch"
                    hideClear
                />
            </div>
        </div>
    );
};
