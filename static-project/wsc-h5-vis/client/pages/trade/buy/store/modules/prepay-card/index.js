import { state } from './state';
import { mutations } from './mutations';
import { getters } from './getters';

export { assignOrderData } from './state';
export const store = {
  state,
  getters,
  mutations,
};
