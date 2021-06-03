export const state = {
  // 礼品卡
  giftCard: {
    list: [],
    disabled: [],
    checked: [],
  },

  // 储值卡
  valueCard: {
    list: [],
    disabled: [],
    checked: [],
  },

  prepayCard: {
    // 是否显示预付卡栏
    showPrePayCards: false,
    // 储值推荐内容
    recommendDetaid: '',
    // 储值推荐文案
    payAssetActivityTagDesc: '',
  },
};

// 避免储值卡礼品卡用户操作记录被 confirm 接口更新
// 新版储值已经不存在giftCard了，全部都归在valueCard里面
// 目前对giftCard的都是兼容处理
let hasPrepayCardData = false;

export const assignOrderData = (state, data) => {
  /**
   * 预付卡计算在前端维护
   * 避免 confirm 接口更新掉用户选择数据
   */
  if (!hasPrepayCardData) {
    // 礼品卡
    Object.assign(state.giftCard, {
      list: data.payGiftCards || [],
      disabled: data.unavailablePayGiftCards || [],
      checked: (data.payGiftCards || [])
        .filter(item => item.selected)
        .map(item => item.summaryCardNo),
    });

    hasPrepayCardData = state.giftCard.list.length || state.giftCard.disabled.length;
  }

  // 储值卡
  Object.assign(state.valueCard, {
    list: data.payValueCards || [],
    disabled: data.unavailablePayValueCards || [],
    checked: (data.payValueCards || [])
      .filter(item => item.selected)
      .map(item => item.summaryCardNo),
  });

  Object.assign(state.prepayCard, {
    showPrePayCards: data.showPrePayCards,
    recommendDetaid: data.recommendDetaid,
    payAssetActivityTagDesc: data.payAssetActivityTagDesc,
  });
};
