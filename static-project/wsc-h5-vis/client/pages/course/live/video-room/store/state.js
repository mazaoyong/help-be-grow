const state = {
  env: {},
  queries: {},

  /** 功能开启状态 */
  foundationStates: {
    reward: false,
    liveSelling: false,
    liveFlowId: undefined,
  },

  liveSellingData: {
    couponList: [],
    goodsList: [],
  },

  pageInfo: {
    goodsList: {
      pageNumber: 1,
      total: 0,
    },
  },

  fetchState: {
    fetchGoodsList: false,
  },
};

export default state;
