const getters = {
  alias(state) {
    return state.queries.alias;
  },
  isIOS(state) {
    return state.env.isIOS || false;
  },
  isMobile(state) {
    return state.env.isMobile || false;
  },
  isRewardOpen(state) {
    return state.foundationStates.reward || false;
  },
  isLiveSellingOpen(state) {
    return state.foundationStates.liveSelling || false;
  },
  goodsPageInfo(state) {
    return state.pageInfo.goodsList;
  },
  goodsFetchState(state) {
    return state.fetchState.fetchGoodsList ? 'pending' : 'done';
  },
  liveRoomId(state) {
    return state.foundationStates.liveFlowId;
  },
  showMyCouponNav(state) {
    const list = state.liveSellingData.couponList;
    if (Array.isArray(list) && list.length) {
      return list.some(couponData => couponData.isReceived);
    }
    return false;
  },
};

export default getters;
