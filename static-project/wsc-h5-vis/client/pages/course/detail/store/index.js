import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

// 业务域
import RecommendGift from '@/domain/recommend-gift/store';

Vue.use(Vuex);

const rootStore = {
  modules: {
    'recommend-gift': RecommendGift,
  },
  state,
  getters,
  actions,
  mutations,
};

const store = new Vuex.Store(rootStore);

export function getDefaultLogParams() {
  const { goodsData } = state;
  const defaultLogParams = {
    alias: goodsData.alias,
    goods_id: goodsData.goodsId,
  };
  if (Number.isInteger(goodsData.courseType)) {
    defaultLogParams.course_type = goodsData.courseType;
  }
  if (Number.isInteger(goodsData.mediaType)) {
    defaultLogParams.media_type = goodsData.mediaType;
  }
  if (Number.isInteger(goodsData.liveType)) {
    defaultLogParams.live_type = goodsData.liveType;
  }
  return defaultLogParams;
}

export default store;
