export const state = {
  goods: {
    // 商品列表
    list: [],
    // 额外的商品信息
    // { [alias]: info }
    extra: {},
  },
};

export const assignOrderData = (state, orderData) => {
  Object.assign(state.goods, {
    list: orderData.orderItems || [],
  });
};
