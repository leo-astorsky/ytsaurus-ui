import {
    GitlabRepository,
    VcsType,
} from '../../ui/pages/query-tracker/module/repoNavigation/repoNavigationSlice';
import axios from 'axios';
import logger from '../../ui/utils/logger';

const GITLAB_API_URL = 'https://gitlab.com/api/v4/projects';

export class GitlabApi {
    token: string;
    constructor(token: string) {
        this.token = token;
    }

    getRequestHeaders() {
        return {
            Authorization: `Bearer ${this.token}`,
        };
    }

    async getRepositories(): Promise<Record<string, GitlabRepository>> {
        try {
            const response = await axios.get<
                {name: string; id: number; web_url: string; default_branch: string}[]
            >(GITLAB_API_URL, {
                headers: this.getRequestHeaders(),
                params: {
                    owned: true,
                },
            });

            return response.data.reduce<Record<string, GitlabRepository>>((acc, repositoryData) => {
                acc[repositoryData.name] = {
                    name: repositoryData.name,
                    webUrl: repositoryData.web_url,
                    projectId: repositoryData.id.toString(),
                    defaultBranch: repositoryData.default_branch,
                    type: VcsType.GITLAB,
                };
                return acc;
            }, {});
        } catch (e) {
            logger.log(e);
            return {};
        }
    }

    async getBranches(projectId: string): Promise<string[]> {
        try {
            const response = await axios.get<{name: string}[]>(
                `${GITLAB_API_URL}/${projectId}/repository/branches`,
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

    async getRepositoryContent(
        projectId: string,
        branch: string,
        path = '',
    ): Promise<{id: string; mode: string; name: string; path: string; type: 'tree' | 'blob'}[]> {
        try {
            const response = await axios.get(
                `${GITLAB_API_URL}/${projectId}/repository/tree?path=${path}`,
                {
                    headers: this.getRequestHeaders(),
                    params: {
                        ref_name: branch,
                    },
                },
            );

            return await response.data;
        } catch (e) {
            logger.log(e);
            return [];
        }
    }

    async getFileContent(projectId: string, branch: string, filePath: string): Promise<string> {
        try {
            const response = await axios.get(
                `${GITLAB_API_URL}/${projectId}/repository/files/${filePath}/raw`,
                {
                    headers: this.getRequestHeaders(),
                    params: {
                        ref_name: branch,
                    },
                },
            );

            return response.data;
        } catch (e) {
            logger.log(e);
            return '';
        }
    }
}
