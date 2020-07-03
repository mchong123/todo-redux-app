import { createReducer, on } from '@ngrx/store';
import { setUser, unSetUser } from './auth.actions';
import { Usuario } from '../models/usuario.models';

export interface State {
    user: Usuario;
}

export const initialState: State = {
   user: null,
};

// tslint:disable-next-line: variable-name
const _authReducer = createReducer(initialState,

    on(setUser, (state, {user}) => ({ ...state, user: {...user}})),
    on(unSetUser, state => ({user: null})),

);

export function authReducer(state, action) {
    return _authReducer(state, action);
}