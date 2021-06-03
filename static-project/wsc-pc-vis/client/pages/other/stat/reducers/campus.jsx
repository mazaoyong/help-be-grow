import React, { createContext, useReducer } from 'react';
import { isEduHqStore } from '@youzan/utils-shop';

const initState = {
  // 校区kdtId
  subKdtId: isEduHqStore ? 0 : _global.kdtId,
};

const campus = createContext(initState);
const { Provider } = campus;

function reducer(state, dispatch) {
  const { type, payload } = dispatch;
  switch (type) {
    // 统一赋值
    case 'setState':
      return {
        ...state,
        ...payload,
      };
    default:
      return initState;
  }
}

const ContextProvider = props => {
  const [context, dispatch] = useReducer(reducer, initState);
  return <Provider value={{ context, dispatch }}>{props.children}</Provider>;
};

export { campus, reducer, ContextProvider };
