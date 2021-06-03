import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import store from '../index';

export default function(params, payload, compositionCB) {
  if (store.state.goodsData.sellerType === SELLER_TYPE.COLUMN) {
    params.productInfoList[0].alias = store.state.goodsData.column.alias;
    params.productInfoList[0].id = null;
  }

  params.umpInfo.promotionType = ACTIVITY_TYPE.GIFT;
  params.channelType = store.state.activityData.channelType;
  params.productInfoList[0].num = payload;

  if (compositionCB) {
    compositionCB({
      activityType: ACTIVITY_TYPE.GIFT,
    });
  }
}
