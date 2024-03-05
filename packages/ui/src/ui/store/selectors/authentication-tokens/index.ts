import {createSelector} from 'reselect';
import {RootState} from '../../reducers';

export type AuthenticationToken = {
    tokenHash: string;
    description?: string;
    creationTime?: string;
    tokenPrefix?: string;
};

export const authenticationTokensSelector = createSelector(
    [(state: RootState) => state.authenticationTokens.tokens?.data],
    (tokens) => {
        if (Array.isArray(tokens)) {
            return tokens.map((token) => ({
                tokenHash: token,
            }));
        }

        return Object.entries(tokens ?? {}).map(([key, value]) => {
            return {
                tokenHash: key,
                description: value.description,
                creationTime: value.creation_time,
                tokenPrefix: value.token_prefix,
            };
        });
    },
);

export const getAuthenticationTokens = createSelector(
    [authenticationTokensSelector, (state) => state.authenticationTokens.filter],
    (tokens, filter) => {
        if (filter.value) {
            return tokens.filter((item) => item.tokenHash === filter.value);
        }

        return tokens;
    },
);

export const getAuthenticationTokensCredentials = (state: RootState) =>
    state.authenticationTokens.credentials;

export const isAuthenticationTokensModalOpened = (state: RootState) =>
    state.authenticationTokens.modal.open;
