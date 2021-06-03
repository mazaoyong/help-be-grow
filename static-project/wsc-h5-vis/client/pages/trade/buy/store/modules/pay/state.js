export const state = {
  // 订单支付信息
  pay: {},

  // 收银台相关数据
  // 之后升级到新收银台可以删除
  cashier: {
    // 支付方式
    payWays: [],
    // 是否显示收银台
    isShowPayView: false,
    // 是否展示密码框
    isShowPassword: false,
    // 当前选中的支付方式数据
    selectedPayWayData: {},
  },
};

export const assignOrderData = (state, orderData) => {
  Object.assign(state.pay, orderData.orderPayment || {});
};
