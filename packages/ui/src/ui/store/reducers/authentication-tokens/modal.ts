import type {Action} from 'redux';

import {
    AUTHENTICATION_TOKENS_MODALS_CLOSE,
    AUTHENTICATION_TOKENS_MODALS_OPEN,
} from '../../../constants/authentication-tokens';

export type AuthenticationTokensModalState = {
    open: boolean;
};

const initialState: AuthenticationTokensModalState = {
    open: false,
};

export type AuthenticationTokensModalAction =
    | Action<typeof AUTHENTICATION_TOKENS_MODALS_CLOSE>
    | Action<typeof AUTHENTICATION_TOKENS_MODALS_OPEN>;

function reducer(state = initialState, action: AuthenticationTokensModalAction) {
    switch (action.type) {
        case AUTHENTICATION_TOKENS_MODALS_OPEN:
            return {open: true};
        case AUTHENTICATION_TOKENS_MODALS_CLOSE:
            return {open: false};
        default:
            return state;
    }
}

export default reducer;
