export const mutations = {
  SET_ORDER_DATA(state, data) {
    state.order.orderNo = data.orderNo;
    const response = data.tradeCreateResponse || {};
    state.pay = {
      ...state.pay,
      prePaymentPreparationDTO: response.prePaymentPreparationDTO || {},
      preparePayResultDTO: response.preparePayResultDTO || {},
      showPayResult: response.showPayResult,
      zeroOrder: response.zeroOrder,
    };
  },
};
