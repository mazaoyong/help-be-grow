import { state } from './state';
import { getters } from './getters';
import { mutations } from './matations';
import { actions } from './actions';

export { assignOrderData } from './state';
export const store = {
  state,
  getters,
  mutations,
  actions,
};
