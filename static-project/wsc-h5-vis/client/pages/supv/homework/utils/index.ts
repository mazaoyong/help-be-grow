import {
  getCommonWeappCode,
  getCommonSwanCode,
  getH5Qrcode,
} from '@/common-api/utils';

import get from 'lodash/get';

export function getShareQrcode(h5url: string): Promise<string> {
  return new Promise(resolve => {
    const miniprogram = _global.miniprogram || {};
    const { isWeapp, isSwanApp } = miniprogram;

    if (isWeapp) {
      // 生成小程序码

      const data = {
        page: `/packages/edu/webview/index`,
        targetUrl: encodeURIComponent(h5url),
      };
      getCommonWeappCode(data)
        .then((res: string) => {
          resolve(res);
        })
        .catch((errMsg: string) => {
          console.error(errMsg);
          resolve('');
        });
    } else if (isSwanApp) {
      const data = {
        targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
          h5url,
        )}`,
      };
      getCommonSwanCode(data)
        .then((res: string) => {
          resolve(res);
        })
        .catch((errMsg: string) => {
          console.warn(errMsg);
          resolve('');
        });
    } else {
      getH5Qrcode({
        url: h5url,
      })
        .then((res: any) => {
          resolve(res);
        })
        .catch(() => {
          resolve('');
        });
    }
  });
}

export function getCommentIcon() {
  const THEME_ICON_MAP = {
    0: 'https://b.yzcdn.cn/public_files/ff1dd4faa0083bcd3e75ba2825d54eb1.png',
    1: 'https://b.yzcdn.cn/public_files/83043907bf1ce84ca82af6cc64fb9250.png',
    2: 'https://b.yzcdn.cn/public_files/9409028ccbb629e4a06e9032354bba79.png',
    3: 'https://b.yzcdn.cn/public_files/ff1dd4faa0083bcd3e75ba2825d54eb1.png',
    4: 'https://b.yzcdn.cn/public_files/bc50041ee833af605eb47c62b374bc1d.png',
    5: 'https://b.yzcdn.cn/public_files/f313aafa134147d4068394a5ea198b79.png',
    6: 'https://b.yzcdn.cn/public_files/dd037eb8d55eade2d0dda4ccddba9fab.png',
    7: 'https://b.yzcdn.cn/public_files/e10efb2ad6192fb6ca295bf8245222aa.png',
    8: 'https://b.yzcdn.cn/public_files/3d1a11ce0b3fa046349d5bc19b269f33.png',
    9: 'https://b.yzcdn.cn/public_files/90834e9b3e3716ada6debd099d96aba7.png',
    10: 'https://b.yzcdn.cn/public_files/51e94dae4b5b494df20a2fe07a916bc4.png',
    // 教育没有这个配色，走默认值
    11: 'https://b.yzcdn.cn/public_files/51e94dae4b5b494df20a2fe07a916bc4.png',
    12: 'https://b.yzcdn.cn/public_files/b53c3eefc104897bbcaeae6aed58c88b.png',
    13: 'https://b.yzcdn.cn/public_files/d312056259899508904dcae9527ba3c2.png',
  } as Record<number, string>;

  const themeType: number = get(window, '_global.themeType', 5);

  return THEME_ICON_MAP[themeType];
}
