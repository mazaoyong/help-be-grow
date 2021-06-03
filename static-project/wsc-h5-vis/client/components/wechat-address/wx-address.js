/**
 * 调用微信 SDK 地址组件
 */

import { ZNB } from '@youzan/wxsdk';
import { Toast } from 'vant';
import { amap } from 'common/amap';

export function callWxAddress() {
  return new Promise((resolve, reject) => {
    ZNB.openAddress()
      .then(address => {
        if (address) {
          amap.fillAddressLocation(address, resolve);
        } else {
          Toast('地址数据错误');
        }
      })
      .catch(res => {
        const msg = res.err_msg || res.errMsg;
        const errDesc = res.err_desc || '';

        // 用户取消选择地址，会报下面三个错误
        if (
          msg === 'openAddress:fail' ||
          msg === 'edit_address:cancel' ||
          (msg === 'edit_address:fail' && !errDesc)
        ) {
          return;
        }
        // 抛出异常，调用 Vue 地址组件
        reject(res);
      });
  });
}
