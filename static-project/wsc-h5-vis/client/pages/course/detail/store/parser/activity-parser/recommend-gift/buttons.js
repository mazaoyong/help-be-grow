import { get } from 'lodash';
import format from '@youzan/utils/money/format';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import getDefaultButtonText from '../default-button-text';
import { CommissionRewardType } from '@/constants/ump/recommend-gift';

export default function(activityData, state) {
  const { sku: activitySku, recommendGift, bid } = activityData;
  const { sku } = state.goodsData;

  // 是否符合被推荐人
  const meetReferee = get(activityData, 'recommendGift.meetReferee');
  // 是否有立减
  const newerSubsidyPrice = get(activityData, 'recommendGift.newerSubsidyPrice', 0);
  // 佣金/好友立减类型
  const commissionRewardType = get(activityData, 'recommendGift.commissionRewardType', CommissionRewardType.FIXED_RATIO);

  const recommendBuy = function() {
    pay(ACTIVITY_TYPE.RECOMMEND_GIFT, null, 'recommend-buy');
  };

  let buttons = [];

  if (bid && meetReferee) {
    if (newerSubsidyPrice || commissionRewardType === CommissionRewardType.FIXED_PRICE) {
      buttons = [{
        text: [`好友推荐专享￥${+format(activitySku.minPrice, true, false)}`, `价格￥${+format(sku.minPrice, true, false)}`],
        action: recommendBuy,
      }];
    } else {
      buttons = [{
        text: getDefaultButtonText(state),
        action: recommendBuy,
      }];
    }
  }

  if (recommendGift.isCourseUmp) {
    return {
      buttons,
      skuButtons: [{
        text: '立即报名',
        action: recommendBuy,
      }],
    };
  } else {
    return {
      buttons,
    };
  }
}
