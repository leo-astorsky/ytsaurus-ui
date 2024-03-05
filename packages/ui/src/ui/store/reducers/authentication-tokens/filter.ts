import type {Action} from 'redux';
import type {ActionD} from '../../../types';

import {
    AUTHENTICATION_TOKENS_FILTER_CLEAR,
    AUTHENTICATION_TOKENS_FILTER_SET,
} from '../../../constants/authentication-tokens';

export type AuthenticationTokensFilterState = {
    value: string;
};

const initialState: AuthenticationTokensFilterState = {
    value: '',
};

export type AuthenticationTokensFilterAction =
    | Action<typeof AUTHENTICATION_TOKENS_FILTER_CLEAR>
    | ActionD<typeof AUTHENTICATION_TOKENS_FILTER_SET, AuthenticationTokensFilterState>;

function reducer(state = initialState, action: AuthenticationTokensFilterAction) {
    switch (action.type) {
        case AUTHENTICATION_TOKENS_FILTER_SET:
            return {...state, ...action.data};
        case AUTHENTICATION_TOKENS_FILTER_CLEAR:
            return {};
        default:
            return state;
    }
}

export default reducer;
