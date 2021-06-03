
import { redirect } from '@/common/utils/custom-safe-link';
import accDiv from '@youzan/utils/number/accDiv';
import args from '@youzan/utils/url/args';
import { getCommonWeappCode, getCommonSwanCode, getH5Qrcode } from '@/common-api/utils';

const kdtId = window._global.kdt_id;

export function navigateToCourseDetailPage(alias: string) {
  redirect({
    url: `/wscvis/course/detail/${alias}`,
    query: {
      kdt_id: kdtId,
    },
  });
}

export function navigateToHomePage() {
  redirect({
    url: '/wscshop/showcase/homepage',
    query: {
      kdt_id: kdtId,
    },
  });
}

export function navigateToActivityEmptyPage() {
  redirect({
    url: '/wscvis/ump/activity-entry/empty',
    query: {
      kdt_id: kdtId,
    },
  });
}

export function formatMoney(moneyAsCent: number) {
  return accDiv(moneyAsCent || 0, 100);
}

export function navigateToOrderDetail(orderNo: string) {
  redirect({
    url: `https://cashier.youzan.com/pay/wsctrade_pay?order_no=${orderNo}`,
    query: {
      kdt_id: kdtId,
    },
  },
  );
}

export function navigateTo(url:string) {
  redirect({
    url,
  });
};

/**  @fixme 公用函数 */
let qrcodeUrl = '';
export function getShareQrcode(h5url: string): Promise<string> {
  return new Promise((resolve) => {
    if (qrcodeUrl) return qrcodeUrl;

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
        targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(h5url)}`,
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
      }).then((res: any) => {
        resolve(res);
      }).catch(() => {
        resolve('');
      });
    }
  });
}

/** 获取来源信息 */
export function getOriginInfo() {
  let origin = '';
  let originValue = '';
  const instanceId = args.get('fromId', location.href);
  if (instanceId && instanceId !== '') {
    // 固定来源为攒学费
    origin = 'TUITION';
    originValue = instanceId;
  }
  return {
    origin,
    origin_value: originValue,
  };
}
