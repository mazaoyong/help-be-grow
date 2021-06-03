export const getters = {
  // 订单是否已创建
  isOrderCreated(state) {
    return !!state.order.orderNo;
  },
};
