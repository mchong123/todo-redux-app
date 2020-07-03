import { createReducer, on } from '@ngrx/store';
import { setItems, unSetItems } from './ingreso-egreso.action';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AppState } from '../app.reducer';

export interface State {
    items: IngresoEgreso[];
}
export interface AppStateWithIngreso extends AppState{
    ingresosEgresos: State;
}

export const initialState: State = {
    items: [],
};

// tslint:disable-next-line: variable-name
const _ingresoReducer = createReducer(initialState,

    on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
    on(unSetItems, state => ({ ...state, items: [] })),

);

export function ingresoReducer(state, action) {
    return _ingresoReducer(state, action);
}
