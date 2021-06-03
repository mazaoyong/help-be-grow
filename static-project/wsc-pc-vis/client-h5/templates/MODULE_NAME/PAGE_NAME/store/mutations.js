import { UPDATE_A } from './mutation-types';

export default {
  [UPDATE_A](state, newA) {
    state.a = newA;
  },
};
