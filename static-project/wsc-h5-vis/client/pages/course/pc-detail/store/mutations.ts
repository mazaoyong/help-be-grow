import { PcDetailState } from './index';
import { MutationTree } from 'vuex';

const mutations: MutationTree<PcDetailState> = {
  goodsType(state, goodsType) {
    state.goodsType = goodsType;
  },

  goodsData(state, goodsData) {
    state.goodsData = goodsData;
  },

  design(state, design) {
    state.design = design;
  },

  liveStatus(state, liveStatus) {
    state.goodsData.liveStatus = liveStatus;
  },
};

export default mutations;
