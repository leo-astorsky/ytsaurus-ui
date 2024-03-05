import {combineReducers} from 'redux';
import modal from './modal';
import filter from './filter';
import tokens from './tokens';
import credentials from './credentials';

export const authenticationTokens = combineReducers({tokens, credentials, modal, filter});
