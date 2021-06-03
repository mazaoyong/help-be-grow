import { visAjax } from 'fns/new-ajax';

// 查询商品锁
export function getRiskLock() {
  return visAjax('GET', '/pct/risk-lock.json');
};
