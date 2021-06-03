import React, { createContext, useReducer } from 'react';

// constants
export const CHANGE_COURSES = 'CHANGE_COURSES';

const initialState = [];

const reducer = (state, { type, payload }) => {
  switch (type) {
    case CHANGE_COURSES:
      return Object.assign([], state, payload);
    default:
      return state;
  }
};

// context & provider
export const Context = createContext(initialState);

export const Provider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};
