import { assignOrderData } from './modules';

const mutations = {
  ASSIGN_ORDER_DATA(state, orderData = {}) {
    assignOrderData(state, orderData);
  },
  UPDATE_DESIGN_DATA(state, yzyunDesign) {
    state.design = [ ...yzyunDesign ];
  },
};

export default mutations;
