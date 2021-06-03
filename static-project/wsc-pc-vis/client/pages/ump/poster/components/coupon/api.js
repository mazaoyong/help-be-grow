// 公众号海报相关接口
import request from 'fns/pct-ajax';

// 海报列表
export function getCouponList() {
  return request(
    'GET',
    '/common/findAllValidCouponListByKdtId.json',
    {
      source: 'meetReduce',
    },
  );
}
