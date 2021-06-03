import React, { createContext, useReducer, FC, Dispatch } from 'react';
import { IState } from './state';
import { reducer, Actions } from './reducer';

const useStore = (reducer: ReducerType, initialState: IState) => {
  const [store, dispatch] = useReducer(reducer, initialState);
  return { store, dispatch };
};

type ReducerType = typeof reducer;

export { getInitialState } from './state';
export { reducer } from './reducer';

export type StateType = IState;
export type DispatchType = Dispatch<Actions>;

export const context = createContext<ReturnType<typeof useStore>>(null as any);

export interface IProviderProps {
  state: IState;
  reducer: ReducerType;
}

export const Provider: FC<IProviderProps> = ({ children, state, reducer }) => {
  const { store, dispatch } = useStore(reducer, state);

  const Provider = context.Provider;
  return <Provider value={{ dispatch, store }}>{children}</Provider>;
};
