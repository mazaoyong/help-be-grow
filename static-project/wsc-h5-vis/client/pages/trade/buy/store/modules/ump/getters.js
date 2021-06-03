import { find, uniq, isEmpty } from 'lodash';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

export const getters = {
  // 订单当前参加活动列表
  activityTypes(state, getters) {
    let activityList = [state.shop.activityType]
      .concat(getters.goodsList.map(({ activityType }) => activityType))
      .filter(
        activityType =>
          activityType !== ACTIVITY_TYPE.NONE &&
          activityType !== ACTIVITY_TYPE.NO_ACTIVITY,
      );
    activityList = uniq(activityList);
    // 买赠通过赠品信息反推。。
    if (!isEmpty(state.present)) {
      activityList.push(ACTIVITY_TYPE.MEET_REDUCE);
    }

    return activityList;
  },

  // 是否是优惠套餐
  isPackageBuy(state) {
    return state.shop.activityType === ACTIVITY_TYPE.PACKAGE_BUY;
  },

  // 是否是优惠套餐-搭配套餐
  isMatchPackageBuy(state, getters) {
    return getters.isPackageBuy && state.packageBuy.type === 1;
  },

  // 是否是拼团或阶梯拼团
  // 目前拼团和阶梯拼团在下单页没有特殊逻辑，统一处理
  isGroupBuy(state) {
    return state.shop.activityType === ACTIVITY_TYPE.GROUP_BUY ||
      state.shop.activityType === ACTIVITY_TYPE.LADDER_GROUPON;
  },

  // 是否是积分商城
  isPointsExchange(state) {
    return state.shop.activityType === ACTIVITY_TYPE.POINTS_EXCHANGE;
  },

  // 是否是秒杀
  isSecKill(state) {
    return state.shop.activityType === ACTIVITY_TYPE.SEC_KILL;
  },

  // 是否是会员折扣
  isCustomerDiscount(_state, getters) {
    return (
      !getters.isPackageBuy &&
      getters.singleGoods.activityType === ACTIVITY_TYPE.CUSTOMER_DISCOUNT
    );
  },

  // 是否是限时折扣
  isTimeLimitDiscount(_state, getters) {
    return (
      !getters.isPackageBuy &&
      getters.singleGoods.activityType === ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT
    );
  },

  // 是否是送礼（请好友看）
  isGift(state) {
    return state.shop.activityType === ACTIVITY_TYPE.GIFT;
  },

  // 当前选中的优惠券
  chosenCoupon(state) {
    const { list, chosenId } = state.coupon;
    return find(list, item => item.id === chosenId) || {};
  },

  // 当前选中的会员优惠
  chosenCustomCard(state) {
    const { list, chosenId } = state.customerCard;
    return find(list, item => item.id === chosenId) || {};
  },

  // 是否显示学费选择的 Cell
  isShowTuitionCell(state) {
    const { userEnableDeduction = 0 } = state.tuition.tuitionDeduction || {};
    return userEnableDeduction > 0;
  },

  isUseTuition(state, getters) {
    if (getters.isShowTuitionCell) {
      return state.useTuition;
    }
    return false;
  },
};
