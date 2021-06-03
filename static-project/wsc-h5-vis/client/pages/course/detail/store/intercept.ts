import { get } from 'lodash';
import { GOODS_TYPE } from '@/constants/course/goodsType';

interface IActivity {
  type: string;
  data: any;
}

/**
 * 针对0元商品和仅关联专栏售卖的商品，拦截券后价活动; 是否应该后端处理？小程序好友助力拦截优惠券
 *
 * @param {Array} activityData 活动信息
 * @param {Object} state store
 * @return {Array}
 */
export function interceptActivityData(activityData: IActivity[], state: any) {
  const { goodsType } = state;
  const couponActivityIdx = activityData.findIndex(
    (item) => item.type === 'coupon',
  );
  if (couponActivityIdx === -1) {
    return activityData;
  }
  function removeCouponActivity() {
    const copyData = [...activityData];
    copyData.splice(couponActivityIdx, 1);
    return copyData;
  }
  // 分销专栏，不展示券后价
  if (goodsType === GOODS_TYPE.FX_COLUMN) {
    return removeCouponActivity();
  }
  const couponActivity = get(activityData, [couponActivityIdx, 'data']);
  // 券后价活动
  const { skuPreferenceList = [] } = couponActivity;
  const skuOriginPrices = skuPreferenceList.map((item: any) => item.price);
  if (skuOriginPrices.some((price: any) => price === 0)) {
    // sku 0元商品，拦截
    return removeCouponActivity();
  }
  // 好友助力活动&小程序，拦截券后价
  const hasCollectZan = activityData.some((item) => item.type === 'collectZan');

  if (hasCollectZan && !!_global.miniprogram?.isMiniProgram) {
    return removeCouponActivity();
  }
  return activityData;
}
