import { UPDATE_LIST, UPDATE_TYPE } from './mutation-types';

export default {
  [UPDATE_LIST](state, payload) {
    state.list = payload;
  },
  [UPDATE_TYPE](state, payload) {
    state.operationType = payload;
  },
};
