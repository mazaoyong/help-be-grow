export const mutations = {
  SET_CHOSEN_CUSTOM_CARD_ID(state, id) {
    state.customerCard.chosenId = id;
  },

  SET_CHOSEN_COUPON_ID(state, id) {
    state.coupon.chosenId = id;
  },

  ADD_COUPON(state, coupon) {
    state.coupon.list.push(coupon);
  },

  SET_PACKAGE_BUY_DATA(state, data) {
    state.packageBuy = data;
  },

  SET_MEET_REDUCE_DATA(state, data) {
    state.present = data;
  },

  SET_IS_USE_TUITION(state, data) {
    state.useTuition = data;
  },
};
