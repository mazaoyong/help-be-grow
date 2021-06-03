import ajax from 'zan-pc-ajax';
import { Notify } from 'zent';

interface IQueryPrivateUrlRequest {
  exportId: number;
  category: string;
}

interface IQueryPrivateUrlResponse {
  url: string;
}

export const getQueryPrivateUrl = (data: IQueryPrivateUrlRequest) => {
  return ajax<IQueryPrivateUrlResponse>('/v4/trade/order/export/fields/queryPrivateUrl.json', {
    method: 'GET',
    data,
  })
    .then(realUrl => {
      if (realUrl) {
        // @ts-ignore
        window.open(realUrl);
      } else {
        Notify.error('报表下载失败');
      }
    })
    .catch(() => {
      Notify.error('报表下载失败');
    });
};
