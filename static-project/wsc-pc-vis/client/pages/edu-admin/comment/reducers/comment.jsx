import React, { createContext, useReducer } from 'react';

const initState = {
  currentGoods: null,
  productId: undefined,
  productAlias: '',
  reloadComments: 0,
  commentList: [],
  // 留言类型 '' 全部留言 '1' 精选 '2' 置顶
  chosenSticky: -1,
  // 校区kdtId
  subKdtId: '',
};

const comment = createContext(initState);
const { Provider } = comment;

function reducer(state, dispatch) {
  const { type, payload } = dispatch;
  switch (type) {
    // 统一赋值
    case 'setState':
      return {
        ...state,
        ...payload,
      };
    case 'setId':
      return { ...state, productId: payload };
    case 'setAlias':
      return { ...state, productAlias: payload };
    case 'setCommentList':
      return { ...state, commentList: payload };
    case 'reloadComments':
      return { ...state, reloadComments: !state.reloadComments };
    default:
      return initState;
  }
}

const ContextProvider = props => {
  const [context, dispatch] = useReducer(reducer, initState);
  return <Provider value={{ context, dispatch }}>{props.children}</Provider>;
};

export { comment, reducer, ContextProvider };
