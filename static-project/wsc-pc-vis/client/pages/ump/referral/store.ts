import createStore from '@youzan/ebiz-state';

const initState = {
  hasBdApp: false, // 是否包含百度app
}

const store = createStore(initState);
const { Provider, useStoreBy } = store;


export {
  Provider,
  useStoreBy
}
