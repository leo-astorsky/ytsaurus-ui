import type {Action} from 'redux';
import type {ActionD} from '../../../types';

import {
    AUTHENTICATION_TOKENS_CREDENTIALS_CLEAR,
    AUTHENTICATION_TOKENS_CREDENTIALS_SET,
} from '../../../constants/authentication-tokens';

export type AuthenticationTokensCredentialsState = {
    password_sha256: string;
    user: string;
};

const initialState: AuthenticationTokensCredentialsState = {
    password_sha256: '',
    user: '',
};

export type AuthenticationTokensCredentialsAction =
    | Action<typeof AUTHENTICATION_TOKENS_CREDENTIALS_CLEAR>
    | ActionD<typeof AUTHENTICATION_TOKENS_CREDENTIALS_SET, AuthenticationTokensCredentialsState>;

function reducer(state = initialState, action: AuthenticationTokensCredentialsAction) {
    switch (action.type) {
        case AUTHENTICATION_TOKENS_CREDENTIALS_SET:
            return {...state, ...action.data};
        case AUTHENTICATION_TOKENS_CREDENTIALS_CLEAR:
            return {};
        default:
            return state;
    }
}

export default reducer;
