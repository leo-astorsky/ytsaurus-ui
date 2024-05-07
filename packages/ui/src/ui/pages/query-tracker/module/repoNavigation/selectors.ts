import {RootState} from '../../../../store/reducers';
import {createSelector} from 'reselect';
import {VcsType} from './repoNavigationSlice';

export const selectExistingTokens = (state: RootState) => state.queryTracker.repoNavigation.tokens;

export const selectActiveTokens = createSelector([selectExistingTokens], (tokens) =>
    Object.entries(tokens).reduce<VcsType[]>((acc, [name, isActive]) => {
        if (isActive) acc.push(name as VcsType);
        return acc;
    }, []),
);
export const selectRepoNavigation = (state: RootState) => state.queryTracker.repoNavigation;
export const selectList = (state: RootState) => state.queryTracker.repoNavigation.list;
export const selectPath = (state: RootState) => state.queryTracker.repoNavigation.path;
export const selectPreview = (state: RootState) => state.queryTracker.repoNavigation.preview;
export const selectListArray = createSelector([selectList], (list) => Object.values(list));
export const selectRepositories = (state: RootState) =>
    state.queryTracker.repoNavigation.repositories;
export const selectVcs = (state: RootState) => state.queryTracker.repoNavigation.vcs;
export const selectRepository = (state: RootState) => state.queryTracker.repoNavigation.repository;
export const selectBranch = (state: RootState) => state.queryTracker.repoNavigation.branch;
export const selectBranches = (state: RootState) => state.queryTracker.repoNavigation.branches;
export const selectRepositoryUrl = createSelector(
    [selectRepository, selectRepositories, selectBranch],
    (repository, repositories, branch) => {
        if (!repository) return '';

        const currentRepository = repositories[repository];

        if (currentRepository.type === VcsType.GITHUB)
            return `https://github.com/${currentRepository.owner}/${repository}/blob/${branch}/`;

        return `${currentRepository.webUrl}/-/blob/${branch}/`;
    },
);
