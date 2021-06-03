const mutations = {
  goodsType(state, goodsType) {
    state.goodsType = goodsType;
  },

  goodsData(state, goodsData) {
    state.goodsData = goodsData;
  },

  goodsCoupons(state, goodsCoupons) {
    state.goodsCoupons = goodsCoupons;
  },
  setOnlineCourseCollectSetting(state, data) {
    state.onlineCourseCollectSetting = data;
  },

  design(state, design) {
    state.design = design;
  },

  activityData(state, activityData) {
    Object.assign(state, activityData);
  },

  setActivityDataCopy(state, data) {
    state.activityDataCopy = data;
  },

  liveStatus(state, liveStatus) {
    state.goodsData.liveStatus = liveStatus;
  },

  selectedSku(state, sku) {
    state.selectedSku = sku;
  },

  selectedGrouponLadder(state, ladder) {
    state.selectedGrouponLadder = ladder;
  },

  skuPopupVisiable(state, skuPopupVisiable) {
    state.skuPopupVisiable = skuPopupVisiable;
  },

  columnFreeContentCount(state, columnFreeContentCount) {
    state.columnFreeContentCount = columnFreeContentCount;
  },

  audioOrVideoPlayEndRecommendGoods(state, audioOrVideoPlayEndRecommendGoods) {
    state.audioOrVideoPlayEndRecommendGoods = audioOrVideoPlayEndRecommendGoods;
  },

  sortType(state, sortType) {
    state.sortType = sortType;
  },

  contentProgress(state, contentProgress) {
    state.contentProgress = contentProgress;
  },

  columnProgress(state, columnProgress) {
    state.columnProgress = columnProgress;
  },

  toggleVideoPlayRate(state, videoPlayRate) {
    state.videoPlayRate = videoPlayRate;
  },

  updateNextOwlInfo(state, payload) {
    state.goodsData.nextOwlInfo = payload;
  },

  setCloseTuitionPopover(state) {
    state.manualCloseTuitionPopover = true;
  },

  // 优惠券状态变更: unreceived, received, unable
  updateCouponStatus(state, payload) {
    const { goodsCoupons } = state;
    const { couponId, status } = payload;
    const curCouponIdx = goodsCoupons.findIndex((item) => item.id === couponId);
    if (curCouponIdx < 0) {
      throw new Error('coupon index error');
    }
    const nextCoupon = { ...goodsCoupons[curCouponIdx], status };
    goodsCoupons.splice(curCouponIdx, 1, nextCoupon);
  },
};

export default mutations;
