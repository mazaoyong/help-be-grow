import { Module } from 'vuex';
import { Toast } from 'vant';
import { IGoods } from './types';
import { getRecommendGoods } from './apis';

interface RecommendState {
  goodsList: IGoods[];
}

const module: Module<RecommendState, any> = {
  state: {
    goodsList: [],
  },
  mutations: {
    updateGoodsList(state, payload) {
      state.goodsList = payload;
    },
  },
  actions: {
    fetchRecommendGoods({ commit }) {
      return getRecommendGoods()
        .then(res => {
          if (res && res.goodsList) {
            commit('updateGoodsList', res.goodsList);
          }
        })
        .catch(errMsg => Toast(errMsg));
    },
  },
};

export default module;
