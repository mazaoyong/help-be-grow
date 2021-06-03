import { ajax } from '@youzan/vis-ui';
import { Toast } from 'vant';
import { getBizTracePoint } from '@/common/biz/point';
import * as CustomSafeLink from '@/common/utils/custom-safe-link';
import { ZNB } from '@youzan/znb';
import Args from '@youzan/utils/url/args';

// 获取bookKey
export const postBookKey = data => {
  data.bizTracePoint = getBizTracePoint();

  return ajax({
    method: 'POST',
    url: '/wscvis/trade/bookKey.json',
    contentType: 'application/json; charset=utf-8',
    data,
  })
    .catch(error => {
      Toast(error || '网络错误，请稍后重试');
      window.yzStackLog && window.yzStackLog.log({
        name: 'buy-bookKey-error',
        message: 'bookKey生成失败',
        extra: {
          data,
          error,
        },
        level: 'error',
      });

      throw error;
    });
};

// 下单页跳转收口(H5 & 小程序)
export const goTradeBuy = (query) => {
  ZNB.init().then(({ platform }) => {
    if (platform === 'weapp') {
      ZNB.navigate({
        weappUrl: Args.add('/packages/edu/trade/buy/index', query),
      });
    } else {
      CustomSafeLink.redirect({
        url: 'https://cashier.youzan.com/pay/wscvis_buy',
        query,
      });
    }
  });
};

// 直接下单
export const postCreate = data => {
  data.bizTracePoint = getBizTracePoint();

  return ajax({
    url: '/wscvis/trade/create.json',
    method: 'POST',
    contentType: 'application/json; charset=utf-8',
    data,
  });
};
