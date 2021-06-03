import ajax from 'zan-pc-ajax';

const isSuperStore = _global.isSuperStore;
const BASE_URL = `${isSuperStore ? _global.url.store : _global.url.base}/v4`;

export function getNewCouponList(data) {
  return ajax({
    method: 'get',
    url: `${BASE_URL}/ump/common/api/coupon-list`,
    data,
  });
}
