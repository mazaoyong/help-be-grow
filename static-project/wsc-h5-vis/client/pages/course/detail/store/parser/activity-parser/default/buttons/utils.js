import * as SafeLink from '@youzan/safe-link';
import { Dialog } from 'vant';
import {
  isRetailMinimalistPartnerStore,
  isUnifiedPartnerStore,
} from '@youzan/utils-shop';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';

export const redirectToShop = (kdtId) => {
  const offlineData = _global.offlineData || {};
  Dialog.confirm({
    message: '当前网店不支持购买，请切换到其他网店',
    confirmButtonText: '立即切换',
  })
    .then(() => {
      SafeLink.redirect({
        url: offlineData.url || '',
        kdtId,
      });
    });
};

export function createGroup({ payload, kdtId }) {
  if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
    redirectToShop(kdtId);
  } else {
    pay(ACTIVITY_TYPE.GROUP_BUY, payload, 'groupon-create');
  }
}

export function originBuy(kdtId) {
  if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
    redirectToShop(kdtId);
  } else {
    pay(ACTIVITY_TYPE.NO_ACTIVITY, null, 'groupon-origin');
  }
}
