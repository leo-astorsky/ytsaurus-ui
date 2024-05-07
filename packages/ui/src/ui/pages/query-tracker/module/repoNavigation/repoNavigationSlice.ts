import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Reducer} from 'redux';

export enum VcsType {
    GITHUB = 'github',
    GITLAB = 'gitlab',
}

export type DirectoryItem = {
    type: 'directory';
    name: string;
};

export type FileItem = {
    type: 'file';
    name: string;
};

export type GithubRepository = {
    name: string;
    owner: string;
    defaultBranch: string;
    type: VcsType.GITHUB;
};

export type GitlabRepository = {
    name: string;
    webUrl: string;
    projectId: string;
    defaultBranch: string;
    type: VcsType.GITLAB;
};

export type Repositories = Record<string, GithubRepository> | Record<string, GitlabRepository>;

export type RepoNavigationState = {
    tokens: Record<VcsType, boolean>;
    repositories: Repositories;
    branches: string[];
    list: Record<string, DirectoryItem | FileItem>;
    vcs: VcsType | undefined;
    repository: string | undefined;
    branch: string | undefined;
    path: string;
    preview: {
        name: string;
        content: string;
    };
};

const initialState: RepoNavigationState = {
    tokens: {
        github: false,
        gitlab: false,
    },
    list: {},
    repositories: {},
    branches: [],
    vcs: undefined,
    repository: undefined,
    branch: undefined,
    path: '',
    preview: {
        name: '',
        content: '',
    },
};

const repoNavigationSlice = createSlice({
    name: 'repoNavigation',
    initialState,
    reducers: {
        setExistingTokens(state, {payload}: PayloadAction<Record<VcsType, boolean>>) {
            state.tokens = payload;
        },
        setRepositories(state, {payload}: PayloadAction<Repositories>) {
            state.repositories = payload;
        },
        setBranches(state, {payload}: PayloadAction<string[]>) {
            state.branches = payload;
        },
        setVcs(state, {payload}: PayloadAction<VcsType | undefined>) {
            return {
                ...initialState,
                tokens: state.tokens,
                vcs: payload,
            };
        },
        setList(state, {payload}: PayloadAction<Record<string, DirectoryItem | FileItem>>) {
            state.list = payload;
        },
        setRepository(state, {payload}: PayloadAction<string | undefined>) {
            return {
                ...state,
                path: initialState.path,
                list: initialState.list,
                branch: payload ? state.repositories[payload].defaultBranch : initialState.branch,
                repository: payload,
            };
        },
        setBranch(state, {payload}: PayloadAction<string | undefined>) {
            state.branch = payload;
        },
        setPath(state, {payload}: PayloadAction<string>) {
            state.path = payload;
        },
        setPreview(state, {payload}: PayloadAction<RepoNavigationState['preview']>) {
            state.preview = payload;
        },
    },
});

export const {
    setExistingTokens,
    setVcs,
    setPath,
    setRepository,
    setRepositories,
    setBranches,
    setBranch,
    setList,
    setPreview,
} = repoNavigationSlice.actions;

export const repoNavigationReducer = repoNavigationSlice.reducer as Reducer<RepoNavigationState>;
