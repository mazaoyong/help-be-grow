import * as SafeLink from '@youzan/safe-link';
import { Dialog } from 'vant';

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
