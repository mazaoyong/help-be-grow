import { ZNB } from '@youzan/wxsdk';
import * as SafeLink from '@youzan/safe-link';
import { ENV } from '@/constants/env';

export function navigateEnv(kdtId: number | string, redirectType = '') {
  const targetKdtId = kdtId || window._global.kdtId || window._global.kdt_id;
  const isGuang = _global.isGuang;
  ZNB.init()
    .then((env: any) => {
      if (env.platform === 'weapp' && !isGuang) {
        ZNB.navigate({
          weappUrl: '/pages/home/dashboard/index',
          type: 'switchTab',
        });
      } else {
        SafeLink.redirect({
          url: `${window._global.url.h5}/wscshop/showcase/homepage?kdt_id=${targetKdtId}`,
          kdtId: targetKdtId,
          redirectType,
        });
      }
    })
    .catch(() => {
      SafeLink.redirect({
        url: `${window._global.url.h5}/wscshop/showcase/homepage?kdt_id=${targetKdtId}`,
        kdtId: targetKdtId,
        redirectType,
      });
    });
}

// 针对小程序嵌入webview视频的非业务域名
export function weappRichtextFilter(richtext: string): string {
  let reg = /(<iframe.+?v.qq.com.+?<\/iframe>)/g;
  let filterRichtext = (richtext || '').replace(reg, '');

  return filterRichtext;
}

// 判断浏览器是不是使用了 x5 内核
export function isX5(): boolean {
  const ua = (navigator.userAgent || '').toLowerCase();
  if (ua) {
    const keys = ['TBS/', 'MQQBrowser/', 'COVC/'];
    return keys.some(key => {
      return ua.indexOf(key.toLowerCase()) > -1;
    });
  }
  return false;
}

// 为了 ts 类型
type MINIPROGRAM_KEYS = keyof Required<IGlobal>['miniprogram'];

const ENV_KEY_MAP: Array<[MINIPROGRAM_KEYS, ENV]> = [
  ['isWeapp', ENV.WEAPP],
  ['isSwanApp', ENV.SWAN_APP],
  ['isQQApp', ENV.QQ_APP],
];

/**
 * 获取当前的环境字符串
 *
 * @return {string} 当前的环境信息
 */
export function getEnv(): ENV {
  const { miniprogram = {} } = _global;
  const { isMiniProgram } = miniprogram;
  if (!isMiniProgram) {
    return ENV.H5;
  }
  for (let entry of ENV_KEY_MAP) {
    if (miniprogram[entry[0]]) {
      return entry[1];
    }
  }
  return ENV.UNKNOWN;
}

/**
 * 判断当前是否是传入的环境
 *
 * @param {string} env - 需要判断的环境
 * @return {boolean} 判断当前是否是传入的环境
 */
export function checkEnv(env: ENV): boolean {
  return getEnv() === env;
}
