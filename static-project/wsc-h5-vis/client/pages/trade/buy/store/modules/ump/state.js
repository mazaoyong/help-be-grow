import { find, get } from 'lodash';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

export const state = {
  // 优惠套餐信息(优惠套餐通过一个mutations来初始化)
  packageBuy: {},

  // 限时折扣信息
  timelimitDiscount: _global.timelimitDiscount || {},

  // 积分商城信息
  pointsExchange: get(_global, 'prepare.umpInfo.pointsExchangeDTO', {}),

  // 推荐有奖信息
  recommendGift: get(_global, 'prepare.umpInfo.recommend', {}),

  // 秒杀信息
  secKill: _global.secKill || {},

  // 会员优惠
  customerCard: {
    chosenId: undefined,
    list: [],
  },

  // 无效的会员优惠
  unavailableCustomerCards: [],

  // 优惠券
  coupon: {
    // 是否显示优惠券入口
    forbidCoupon: false,
    chosenId: undefined,
    list: [],
    disabledList: [],
  },

  // 赠品
  present: {},

  // 粉丝专享价信息
  fansBenefit: {
    name: '',
    value: 0,
  },

  // 阶梯拼团
  ladderGroupon: {
    ladderNum: get(_global, 'prepare.umpInfo.ladderNum'),
  },

  // 攒学费
  tuition: {
    tuitionDeduction: get(_global, 'prepare.tuitionDeduction', {}),
  },

  // 是否选择学费
  useTuition: true,
  pointsName: _global.visPointsName || '积分',
};

// 设置叠加活动信息
function assignCompositionData(orderData) {
  const compositionKeyMap = {
    [ACTIVITY_TYPE.TUITION]: 'tuition',
    [ACTIVITY_TYPE.RECOMMEND_GIFT]: 'recommendGift',
  };

  const { promotionList = [] } = orderData;
  for (let promotion of promotionList) {
    let key;
    if ((key = compositionKeyMap[promotion.promotionType])) {
      const originData = state[key] || {};
      Object.assign(originData, promotion);
    }
  }
}

export const assignOrderData = (state, orderData) => {
  const customerCards = orderData.customerCards || [];
  const unavailableCustomerCards = orderData.unavailableCustomerCards || [];

  // 会员优惠
  Object.assign(state.customerCard, {
    list: customerCards || [],
  });

  // 无效的会员优惠
  Object.assign(state, {
    unavailableCustomerCards: unavailableCustomerCards || [],
  });

  const chosenCustomCard = find(customerCards, item => item.chosen) || {};
  if (chosenCustomCard.id) {
    state.customerCard.chosenId = chosenCustomCard.id;
  }

  // 粉丝优惠
  Object.assign(state.fansBenefit, get(orderData, 'fansBenefit', {
    name: '',
    value: 0,
  }));

  // 优惠券
  Object.assign(state.coupon, {
    forbidCoupon: orderData.forbidCoupon,
    list: orderData.coupons || [],
    disabledList: orderData.unavailableCoupons || [],
  });

  // 攒学费
  Object.assign(state.tuition, { tuitionDeduction: get(orderData, 'tuitionDeduction') || {} });

  // 设置有叠加关系的活动信息
  assignCompositionData(orderData);
};
