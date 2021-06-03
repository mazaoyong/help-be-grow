const mutations = {
  setQueries(state, queriesPayload) {
    state.queries = {
      ...state.queries,
      ...queriesPayload,
    };
  },
  setRewardSetting(state, rewardState) {
    state.foundationStates.reward = rewardState;
  },
  setLiveSellingSetting(state, liveSellingSetting) {
    state.foundationStates = {
      ...state.foundationStates,
      ...liveSellingSetting,
    };
  },
  setEnv(state, envPayload) {
    state.env = envPayload;
  },
  /** 设置优惠券列表数据 */
  setCouponList(state, couponList) {
    state.liveSellingData.couponList = couponList;
  },
  /** 设置商品列表数据 */
  setGoodsList(state, { goodsList, pageNumber }) {
    if (pageNumber === 1) {
      state.liveSellingData.goodsList = goodsList;
    } else {
      state.liveSellingData.goodsList.push(...goodsList);
    }
  },
  increaseGoodsListPage(state, total) {
    if (total !== undefined) {
      state.pageInfo.goodsList.total = total;
    }
    state.pageInfo.goodsList.pageNumber += 1;
  },
  resetGoodsListPage(state) {
    state.pageInfo.goodsList.total = 0;
    state.pageInfo.goodsList.pageNumber = 1;
  },
  setFetchGoodsListState(state, curState) {
    state.fetchState.fetchGoodsList = curState;
  },
};

export default mutations;
