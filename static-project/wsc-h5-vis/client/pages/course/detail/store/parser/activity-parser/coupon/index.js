import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { get, keyBy } from 'lodash';
import buttonsRule from './buttons';

/**
 *
 * @param {Object} data coupon Data
 * @param {Object} state store.state
 * @param {Array} activityTypes activityTypes
 * @return {string}
 * 存在多活动组合，如：好友推荐券后，拼团券后
 * 限时折扣,会员优惠,多人拼团,赠品,推荐有奖,积分抵现,公众号涨粉
 * 1. 限时折扣和拼团同时存在，展示“限时券后”
 * 2.多人拼团
  进行中：展示拼团价，券后价标签内文案：“拼团券后￥xx（起）”
  未开始：展示原价，券后价标签内文案：“券后￥xx（起）”
 */
function parsePriceTag(data, state, activityTypes) {
  const activityTypesMap = activityTypes.reduce((total, cur) =>
    Object.assign(total, { [cur]: true }),
  );

  // 限时折扣
  if (activityTypesMap[ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT]) {
    return '限时券后';
  } else if (activityTypesMap[ACTIVITY_TYPE.GROUP_BUY]) {
    // 拼团
    const originActivity = get(_global, 'activityData', []);
    const originActivityMap = keyBy(originActivity, 'type');
    const { isStart } = get(originActivityMap, 'groupon.data', {});
    if (isStart) {
      return '拼团券后';
    }
  } else if (activityTypesMap[ACTIVITY_TYPE.CUSTOMER_DISCOUNT]) {
    // 会员
    return '会员券后';
  } else if (activityTypesMap[ACTIVITY_TYPE.RECOMMEND_GIFT]) {
    // 好友推荐
    return '好友推荐券后';
  } else {
    return '券后';
  }
}

function getSkuMap(data, preActivityData) {
  const preActivitySkuMap = get(preActivityData, 'sku.map', {});
  const map = data.reduce((obj, item) => {
    const { skuId } = item;
    const { price: preActivityPrice } = get(preActivitySkuMap, skuId, {});

    obj[skuId] = {
      price: preActivityPrice >= 0 ? preActivityPrice : item.price,
      preActivityPrice,
      couponPrice: item.preferentialPrice,
    };
    return obj;
  }, {});
  return map;
}

function parseSku(data = {}, state, activityDataMap) {
  const { skuPreferenceList, optimalSkuPreference } = data;
  // 找到 coupon 活动之前的活动
  const keys = Object.keys(activityDataMap);
  // const couponIdx = keys.findIndex((key) => key === '' + ACTIVITY_TYPE.COUPON);
  let preActivitySkuInfo;
  let preActivityData;
  // 假设性，coupon 前有活动
  if (keys.length) {
    // 存在其他活动价, couponIdx !== 1 异常
    const preActivityKey = keys[0];
    if (preActivityKey > 1) {
      preActivityData = activityDataMap[preActivityKey]; //
      const { maxPrice, minPrice } = get(preActivityData, 'sku', {});
      preActivitySkuInfo = { maxPrice, minPrice };
    }
  }

  // debugger;

  // 无sku
  if (!!optimalSkuPreference && !skuPreferenceList) {
    const { preferentialPrice: minCouponPrice = 0 } = optimalSkuPreference;
    return {
      ...preActivitySkuInfo,
      minCouponPrice,
      maxCouponPrice: minCouponPrice,
    };
  }

  // 多sku
  let preMinPrice = Number.MAX_VALUE;
  let preMaxPrice = 0;
  if (Array.isArray(skuPreferenceList) && skuPreferenceList.length) {
    const length = skuPreferenceList.length;
    for (let i = 0; i < length; i++) {
      const { preferentialPrice: minPrice = 0 } = skuPreferenceList[i] || {};
      if (minPrice < preMinPrice) {
        preMinPrice = minPrice;
      }
      if (minPrice > preMaxPrice) {
        preMaxPrice = minPrice;
      }
    }
  }
  return {
    ...preActivitySkuInfo,
    minCouponPrice: preMinPrice === Number.MAX_VALUE ? 0 : preMinPrice,
    maxCouponPrice: preMaxPrice,
    map: getSkuMap(skuPreferenceList, preActivityData),
  };
}

export default function(data, state, activityTypes, activityDataMap) {
  const activityData = {
    // 活动通用属性
    hasUmpBlock: false,

    status: ACTIVITY_STATUS.GOING,

    coupon: data,

    priceTag: parsePriceTag(data, state, activityTypes),

    sku: parseSku(data, state, activityDataMap),
  };

  return {
    activityData,
    ...buttonsRule(activityData, state, activityTypes, activityDataMap),
  };
}
