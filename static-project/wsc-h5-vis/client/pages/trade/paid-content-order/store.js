
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    usedCouponPrice: 0, // 当前使用的优惠券折扣的价格，单位为分
    usedPrePayCardPrice: 0, // 当前使用的礼品卡/储值卡折扣的价格，单位为分
    giftCardNos: [], // 当前选中的礼品卡号
    valueCardNos: [], // 当前选择的储值卡号
  },
  actions: {
    updateCouponPrice({ commit }, data = {}) {
      commit('UPDATE_COUPON_PRICE', data);
    },
    updatePrePayCardPrice({ commit }, data = {}) {
      commit('UPDATE_PRE_PAY_CARD_PRICE', data);
    },
  },
  mutations: {
    UPDATE_COUPON_PRICE(state, data) {
      state.usedCouponPrice = data;
    },
    UPDATE_PRE_PAY_CARD_PRICE(state, data) {
      if (data.cardType === 'giftCard') {
        state.valueCardNos = [];
        state.giftCardNos = data.summaryCardNo;
      } else {
        state.valueCardNos = data.summaryCardNo;
        state.giftCardNos = [];
      }
      state.usedPrePayCardPrice = data.price;
    },
  },
  getters: {
    usedCouponPrice(state) {
      return state.usedCouponPrice;
    },
    usedPrePayCardPrice(state) {
      return state.usedPrePayCardPrice;
    },
    giftCardNos(state) {
      return state.giftCardNos;
    },
    valueCardNos(state) {
      return state.valueCardNos;
    },
  },
});

export default store;
