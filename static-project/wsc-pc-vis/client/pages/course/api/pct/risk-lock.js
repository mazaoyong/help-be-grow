// 零售 / 零售营销 / 营销组件
import request from 'fns/pct-ajax';

// 优惠券列表
export function getRiskLockAPI() {
  return request('GET', '/risk-lock.json');
}
