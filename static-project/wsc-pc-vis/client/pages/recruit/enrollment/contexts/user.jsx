import React, { createContext, useReducer } from 'react';
import merge from 'lodash/merge';

// constants
export const CHANGE_USER = 'CHANEG_USER';
export const CHANGE_MOBILE = 'CHANGE_MOBILE';
export const SET_FIELDS = 'SET_FIELDS';

const initialState = {};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case CHANGE_USER:
      if (payload.mode) {
        // payload: object - user
        return merge({}, state, payload);
      }
      return Object.assign({}, state, { item: undefined, mode: undefined });
    case CHANGE_MOBILE:
      // payload: string - mobile
      const item = Object.assign({}, state.item, { mobile: payload });
      return Object.assign({}, state, { item });
    case SET_FIELDS:
      // 设置自定义选项的配置信息
      return Object.assign({}, state, { fields: payload });
    default:
      return state;
  }
};

// context & provider
export const Context = createContext(initialState);

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};
