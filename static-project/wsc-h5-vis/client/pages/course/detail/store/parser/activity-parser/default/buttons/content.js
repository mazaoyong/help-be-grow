import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import { isRetailMinimalistPartnerStore, isUnifiedPartnerStore } from '@youzan/utils-shop';
import { redirectToShop } from './utils';

export default function(state, defaultButtonText) {
  const { goodsData } = state;
  const { isOwnAsset, sellerType, column, sku, needOrder } = goodsData;

  if (needOrder || !isOwnAsset) {
    const buttons = [];

    if (sellerType === SELLER_TYPE.COLUMN || sellerType === SELLER_TYPE.BOTH) {
      buttons.push({
        text: '查看专栏',
        url: `/wscvis/course/detail/${column.alias}?kdt_id=${_global.kdtId || ''}`,
      });
    }
    if (sellerType === SELLER_TYPE.SINGLE || sellerType === SELLER_TYPE.BOTH) {
      buttons.push({
        text: defaultButtonText,
        action: () => {
          if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
            redirectToShop(_global.kdtId);
          } else {
            pay(ACTIVITY_TYPE.NO_ACTIVITY, null, sku.minPrice ? 'default' : 'zero-buy');
          }
        },
      });
    }
    return {
      buttons,
    };
  }
}
