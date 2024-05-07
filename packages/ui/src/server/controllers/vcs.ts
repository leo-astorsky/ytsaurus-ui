import {AppRouteHandler, Response} from '@gravity-ui/expresskit';
import {
    GithubRepository,
    GitlabRepository,
    VcsType,
} from '../../ui/pages/query-tracker/module/repoNavigation/repoNavigationSlice';
import {GithubApi} from '../classes/GithubApi';
import {GitlabApi} from '../classes/GitlabApi';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 1000 * 60 * 60 * 24 * 365,
};

const ERROR_MESSAGE = {
    VCS_REQUIRED: 'Vcs type is required',
    VCS_NOT_SUPPORTED: 'This vcs type is not supported',
    TOKEN_REQUIRED: 'Token is required',
    PATH_REQUIRED: 'Path is required',
    BRANCH_REQUIRED: 'Branch is required',
    REPOSITORY_REQUIRED: 'Repository is required',
};

const sendError = (res: Response, status: number, message: string) => {
    res.status(status).send({error: message});
};

export const createToken: AppRouteHandler = (req, res) => {
    const {vcsType, token} = req.body;
    const vcs = Object.values(VcsType);

    if (!vcsType) {
        sendError(res, 400, ERROR_MESSAGE.VCS_REQUIRED);
        return;
    }

    if (!vcs.includes(vcsType)) {
        sendError(res, 400, ERROR_MESSAGE.VCS_NOT_SUPPORTED);
        return;
    }

    if (!token) {
        sendError(res, 400, ERROR_MESSAGE.TOKEN_REQUIRED);
        return;
    }

    res.cookie(vcsType, token, COOKIE_OPTIONS);
    res.status(200).json({message: `${vcsType} token created`});
};

export const showAllTokens: AppRouteHandler = (req, res) => {
    const cookies = req.cookies;
    const result: Record<VcsType, boolean> = {
        [VcsType.GITHUB]: VcsType.GITHUB in cookies,
        [VcsType.GITLAB]: VcsType.GITLAB in cookies,
    };

    res.status(200).json(result);
};

export const removeToken: AppRouteHandler = (req, res) => {
    const {vcsType} = req.body;

    if (!vcsType) {
        sendError(res, 400, ERROR_MESSAGE.VCS_REQUIRED);
    }

    res.clearCookie(vcsType);
    res.status(200).json({success: true});
};

export const getRepositories: AppRouteHandler = async (req, res) => {
    const cookies = req.cookies;
    const vcsType = req.query.vcsType as string | undefined;

    if (!vcsType) {
        sendError(res, 400, ERROR_MESSAGE.VCS_REQUIRED);
        return;
    }

    const token = cookies[vcsType];

    if (!token) {
        sendError(res, 400, ERROR_MESSAGE.TOKEN_REQUIRED);
        return;
    }

    const api = vcsType === VcsType.GITHUB ? new GithubApi(token) : new GitlabApi(token);

    try {
        res.status(200).json(await api.getRepositories());
    } catch (e) {
        sendError(res, 500, (e as Error).message);
    }
};

export const getBranches: AppRouteHandler = async (req, res) => {
    const cookies = req.cookies;
    const repository = req.query.repository as GithubRepository | GitlabRepository | undefined;

    if (!repository) {
        sendError(res, 400, ERROR_MESSAGE.REPOSITORY_REQUIRED);
        return;
    }

    const token = cookies[repository.type];

    if (!token) {
        sendError(res, 400, ERROR_MESSAGE.TOKEN_REQUIRED);
        return;
    }

    try {
        if (repository.type === 'gitlab') {
            const api = new GitlabApi(token);
            res.status(200).json(await api.getBranches(repository.projectId));
            return;
        }

        const api = new GithubApi(token);
        res.status(200).json(await api.getBranches(repository.owner, repository.name));
    } catch (e) {
        sendError(res, 500, (e as Error).message);
    }
};

export const getDirectoryContent: AppRouteHandler = async (req, res) => {
    const cookies = req.cookies;
    const repository = req.query.repository as GithubRepository | GitlabRepository | undefined;
    const path = req.query.path as string | undefined;
    const branch = req.query.branch as string | undefined;

    if (path === undefined) {
        sendError(res, 400, ERROR_MESSAGE.PATH_REQUIRED);
        return;
    }

    if (!repository) {
        sendError(res, 400, ERROR_MESSAGE.REPOSITORY_REQUIRED);
        return;
    }

    if (!branch) {
        sendError(res, 400, ERROR_MESSAGE.BRANCH_REQUIRED);
        return;
    }

    const token = cookies[repository.type];

    if (!token) {
        sendError(res, 400, ERROR_MESSAGE.TOKEN_REQUIRED);
        return;
    }

    try {
        if (repository.type === 'gitlab') {
            const api = new GitlabApi(token);
            res.status(200).json(
                await api.getRepositoryContent(repository.projectId, branch, path),
            );
            return;
        }

        const api = new GithubApi(token);
        res.status(200).json(await api.getContent(repository.owner, repository.name, path, branch));
    } catch (e) {
        sendError(res, 500, (e as Error).message);
    }
};

export const getFileContent: AppRouteHandler = async (req, res) => {
    const cookies = req.cookies;
    const repository = req.query.repository as GithubRepository | GitlabRepository | undefined;
    const path = req.query.path as string | undefined;
    const branch = req.query.branch as string | undefined;

    if (!path) {
        sendError(res, 400, ERROR_MESSAGE.PATH_REQUIRED);
        return;
    }

    if (!repository) {
        sendError(res, 400, ERROR_MESSAGE.REPOSITORY_REQUIRED);
        return;
    }

    if (!branch) {
        sendError(res, 400, ERROR_MESSAGE.BRANCH_REQUIRED);
        return;
    }

    const token = cookies[repository.type];

    if (!token) {
        sendError(res, 400, ERROR_MESSAGE.TOKEN_REQUIRED);
        return;
    }

    try {
        res.set('content-type', 'text/json');
        if (repository.type === 'gitlab') {
            const api = new GitlabApi(token);
            res.status(200).send(await api.getFileContent(repository.projectId, branch, path));
            return;
        }

        const api = new GithubApi(token);
        res.status(200).send(
            await api.getFileContent(repository.owner, repository.name, path, branch),
        );
    } catch (e) {
        sendError(res, 500, (e as Error).message);
    }
};
