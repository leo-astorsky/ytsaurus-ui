import type {Action} from 'redux';

import type {ActionD, YTError} from '../../../types';

import {AUTHENTICATION_TOKENS_LIST} from '../../../constants/authentication-tokens';

import {mergeStateOnClusterChange} from '../utils';

export type AuthenticationTokensListState = {
    loading: boolean | undefined;
    loaded: boolean | undefined;
    error: YTError | undefined;
    data:
        | Array<string>
        | null
        | Record<
              string,
              {
                  creation_time?: string;
                  description?: string;
                  effective_expiration: {time?: string; timeout?: string};
                  token_prefix?: string;
              }
          >;
};

const initialState: AuthenticationTokensListState = {
    loading: undefined,
    loaded: undefined,
    error: undefined,
    data: null,
};

export type AuthenticationTokensListAction =
    | Action<typeof AUTHENTICATION_TOKENS_LIST.REQUEST>
    | ActionD<
          typeof AUTHENTICATION_TOKENS_LIST.SUCCESS,
          Pick<AuthenticationTokensListState, 'data'>
      >
    | Action<typeof AUTHENTICATION_TOKENS_LIST.CANCELLED>
    | ActionD<
          typeof AUTHENTICATION_TOKENS_LIST.FAILURE,
          Pick<AuthenticationTokensListState, 'error'>
      >;

function reducer(state = initialState, action: AuthenticationTokensListAction) {
    switch (action.type) {
        case AUTHENTICATION_TOKENS_LIST.REQUEST:
            return {...state, loading: true};
        case AUTHENTICATION_TOKENS_LIST.SUCCESS:
            return {...state, ...action.data, loading: false, loaded: true};
        case AUTHENTICATION_TOKENS_LIST.CANCELLED:
            return {...state, loading: false};
        case AUTHENTICATION_TOKENS_LIST.FAILURE:
            return {...state, loading: false, ...action.data};
        default:
            return state;
    }
}

export default mergeStateOnClusterChange(initialState, {}, reducer);
