export const mutations = {
  SET_CASHIER_PAY_WAYS(state, payWays = []) {
    state.cashier.payWays = payWays;
  },

  SET_CASHIER_SHOW_PAY_VIEW(state, isShow) {
    state.cashier.isShowPayView = isShow;
  },

  SET_CASHIER_SHOW_PASSWORD(state, isShow) {
    state.cashier.isShowPassword = isShow;
  },

  SET_CASHIER_SELECTED_PAY_WAY_DATA(state, data) {
    state.cashier.selectedPayWayData = data;
  },
};
