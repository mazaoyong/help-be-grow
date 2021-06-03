import { StoreOptions } from 'vuex';

import state, { IStoreState } from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

const store: StoreOptions<IStoreState> = {
  state,
  getters,
  mutations,
  actions,
};

export default store;
