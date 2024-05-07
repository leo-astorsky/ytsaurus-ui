import {
    GithubRepository,
    VcsType,
} from '../../ui/pages/query-tracker/module/repoNavigation/repoNavigationSlice';
import axios from 'axios';
import logger from '../../ui/utils/logger';

const GITHUB_API_URL = 'https://api.github.com';

export class GithubApi {
    token: string;
    constructor(token: string) {
        this.token = token;
    }

    getRequestHeaders() {
        return {
            Authorization: `token ${this.token}`,
        };
    }

    async getRepositories(): Promise<Record<string, GithubRepository>> {
        try {
            const response = await axios.get<
                {name: string; owner: {login: string}; default_branch: string}[]
            >(`${GITHUB_API_URL}/user/repos`, {
                headers: this.getRequestHeaders(),
            });

            return response.data.reduce<Record<string, GithubRepository>>((acc, repositoryData) => {
                acc[repositoryData.name] = {
                    name: repositoryData.name,
                    owner: repositoryData.owner.login,
                    defaultBranch: repositoryData.default_branch,
                    type: VcsType.GITHUB,
                };
                return acc;
            }, {});
        } catch (e) {
            logger.log(e);
            return {};
        }
    }

    async getBranches(owner: string, repositoryName: string): Promise<string[]> {
        try {
            const response = await axios.get<{name: string}[]>(
                `${GITHUB_API_URL}/repos/${owner}/${repositoryName}/branches`,
                {
                    headers: this.getRequestHeaders(),
                },
            );

            return response.data.map((i) => i.name);
        } catch (e) {
            logger.log(e);
            return [];
        }
    }

    async getContent(
        owner: string,
        repo: string,
        path: string,
        branch: string,
    ): Promise<{name: string; type: 'tree' | 'blob'}[]> {
        try {
            const response = await axios.get(
                `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`,
                {
                    headers: this.getRequestHeaders(),
                    params: {
                        ref: branch,
                    },
                },
            );

            return response.data;
        } catch (e) {
            logger.log(e);
            return [];
        }
    }

    async getFileContent(
        owner: string,
        repo: string,
        path: string,
        branch: string,
    ): Promise<string> {
        try {
            const response = await axios.get(
                `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`,
                {
                    headers: this.getRequestHeaders(),
                    params: {
                        ref: branch,
                    },
                },
            );

            return Buffer.from(response.data.content, 'base64').toString();
        } catch (e) {
            logger.log(e);
            return '';
        }
    }
}
