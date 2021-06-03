import { reduce, cloneDeep } from 'lodash';
import { GOODS_TYPE } from '@/constants/course/goods-type';
import { GOODS_STATUS, GOODS_STATUS_MESSAGE } from '@/constants/course/goods-status';
import { ACTIVITY_TYPE, ACTIVITY_TYPE_STR } from '@/constants/ump/activity-type';
import { navigateEnv } from '@/common/utils/env';
import assignDeep from '@/pages/course/detail/utils/assign-deep';

import defaultParser from './default';
import groupBuy from './group-buy';
import ladderGroupOn from './ladder-group-on';
import timeLimitDiscount from './time-limit-discount';
import seckill from './seckill';
import packageBuy from './package-buy';
import meetReduce from './meet-reduce';
import coupon from './coupon';
import collectZan from './collect-zan';
import gift from './gift';
import share from './share';
import invite from './invite';
import recommendGift from './recommend-gift';
import customerDiscount from './customer-discount';
import pointExchange from './points-exchange';
import fansBenefit from './fans-benefit';
import wecomFansBenefit from './wecom-fans-benefit';
import tuition from './tuition';
import { interceptActivityData } from '../../intercept';

// 在多个营销活动都有对应按钮时，通过优先级判断在进页面第一次通过 sku-block 打开 sku-popup 时，使用哪个营销活动按钮
const PRIORITY = [
  // 对按钮、价格没有影响的活动
  ACTIVITY_TYPE.GIFT,
  ACTIVITY_TYPE.INVITE,
  ACTIVITY_TYPE.SHARE,
  ACTIVITY_TYPE.PACKAGE_BUY,
  ACTIVITY_TYPE.KNOWLEDGE_MEET_REDUCE,
  ACTIVITY_TYPE.FANS_BENEFIT,
  ACTIVITY_TYPE.WECOM_FANS_BENEFIT,
  // 对按钮、价格有影响的活动
  ACTIVITY_TYPE.CUSTOMER_DISCOUNT,
  ACTIVITY_TYPE.GROUP_BUY,
  ACTIVITY_TYPE.LADDER_GROUPON,
  ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT,
  ACTIVITY_TYPE.SEC_KILL,
  ACTIVITY_TYPE.TUITION,
  ACTIVITY_TYPE.COLLECT_ZAN,
  ACTIVITY_TYPE.RECOMMEND_GIFT,
  ACTIVITY_TYPE.POINTS_EXCHANGE,
  ACTIVITY_TYPE.COUPON,
];

const PARSER_MAP = {
  [ACTIVITY_TYPE.GROUP_BUY]: groupBuy,
  [ACTIVITY_TYPE.LADDER_GROUPON]: ladderGroupOn,
  [ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT]: timeLimitDiscount,
  [ACTIVITY_TYPE.SEC_KILL]: seckill,
  [ACTIVITY_TYPE.PACKAGE_BUY]: packageBuy,
  [ACTIVITY_TYPE.KNOWLEDGE_MEET_REDUCE]: meetReduce,
  [ACTIVITY_TYPE.COLLECT_ZAN]: collectZan,
  [ACTIVITY_TYPE.GIFT]: gift,
  [ACTIVITY_TYPE.SHARE]: share,
  [ACTIVITY_TYPE.INVITE]: invite,
  [ACTIVITY_TYPE.RECOMMEND_GIFT]: recommendGift,
  [ACTIVITY_TYPE.CUSTOMER_DISCOUNT]: customerDiscount,
  [ACTIVITY_TYPE.POINTS_EXCHANGE]: pointExchange,
  [ACTIVITY_TYPE.FANS_BENEFIT]: fansBenefit,
  [ACTIVITY_TYPE.TUITION]: tuition,
  [ACTIVITY_TYPE.COUPON]: coupon,
  [ACTIVITY_TYPE.WECOM_FANS_BENEFIT]: wecomFansBenefit,
};

export default function activityParser(originActivityData, state, getters = {}) {
  const activityData = interceptActivityData(originActivityData, state);
  const { goodsData, goodsType, env } = state;
  const defaultData = defaultParser(null, state, getters);
  const parsedActivityData = defaultData.activityData;
  const activityTypes = [ACTIVITY_TYPE.NO_ACTIVITY];
  let message = defaultData.message || '';
  let buttons = defaultData.buttons;
  let shareInfo = defaultData.shareInfo;
  let priorActivityType = null; // 营销活动优先级
  const parsedActivityDataMap = {};
  const skuButtonsMap = {
    [ACTIVITY_TYPE.NO_ACTIVITY]: defaultData.skuButtons || [],
  };

  const activityDataMap = reduce(activityData, (obj, item) => {
    obj[ACTIVITY_TYPE_STR[item.type]] = item.data;
    return obj;
  }, {});

  PRIORITY.forEach(type => {
    if (activityDataMap[type]) {
      const parser = PARSER_MAP[type];
      if (parser) {
        try {
          const data = parser(activityDataMap[type], state, activityTypes, parsedActivityDataMap);
          if (env.isWeapp || type !== ACTIVITY_TYPE.COLLECT_ZAN) { // 如果是小程序环境才会展示好友助力(如果不是在小程序场景的好友助力活动不需要给好友助力加优先级)
            priorActivityType = type;
          }
          activityTypes.push(type);
          parsedActivityDataMap[type] = cloneDeep(data.activityData);
          assignDeep(parsedActivityData, data.activityData);
          // 由于直播在购买后需要使用直播的 default 按钮逻辑，所以这里加上前置判断：线下课或者知识付费未拥有资产时才处理活动按钮
          if (goodsType === GOODS_TYPE.COURSE || !goodsData.isOwnAsset) {
            if (data.message) {
              message = data.message;
            }
            if (data.buttons && data.buttons.length) {
              buttons = data.buttons;
            }
            if (data.skuButtons && data.skuButtons.length) {
              skuButtonsMap[type] = data.skuButtons;
            }
          }

          if (data.shareInfo) {
            shareInfo = Object.assign({}, shareInfo, data.shareInfo);
          }
        } catch (e) {}
      }
    }
  });

  const homeButton = {
    text: '查看其他课程',
    action: navigateEnv,
  };

  // 由于直播在购买后需要使用直播的 default 按钮逻辑，所以这里加上前置判断：线下课或者知识付费未拥有资产时才处理商品状态和限购
  if (goodsType === GOODS_TYPE.COURSE || !goodsData.isOwnAsset) {
    // 兜底判断商品状态和限购状态
    if (goodsData.status !== GOODS_STATUS.SELLING) {
      message = GOODS_STATUS_MESSAGE[goodsData.status];
      buttons = [homeButton];
      skuButtonsMap[ACTIVITY_TYPE.NO_ACTIVITY] = [homeButton];
    }
    if (goodsData.purchaseLimit) {
      message = `你已超过购买次数限制（${goodsData.quota}次）`;
      buttons = [homeButton];
      skuButtonsMap[ACTIVITY_TYPE.NO_ACTIVITY] = [homeButton];
    }
  }

  return {
    activityTypes,
    activityData: parsedActivityData,
    activityDataMap: parsedActivityDataMap,
    message,
    buttons,
    shareInfo,
    skuButtonsMap,
    priorActivityType,
  };
}
