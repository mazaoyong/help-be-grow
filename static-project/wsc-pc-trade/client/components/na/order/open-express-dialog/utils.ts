import ajax from 'zan-pc-ajax';
import get from 'lodash/get';

export function makeRequest<T = any>(method, url, data = {}) {
  const options = {
    url,
    method,
    data,
  };
  return ajax<T>(options);
}

export function getDefaultExpressId() {
  let defaultId: number | '' = '';
  // 默认取商家上次发货选的快递公司
  try {
    defaultId = +localStorage.getItem('default_express_id')! || '';
  } catch (e) {
    // do nothing
  }
  return defaultId;
}

export function setDefaultExpressId(expressId: number | '') {
  try {
    localStorage.setItem('default_express_id', expressId as string);
  } catch (err) {
    // do nothing
  }
}

// 是否为快手订单
export function isKuaishouOrder(orderInfo) {
  return get(orderInfo, 'tc_order_source_d_t_o.orderSourceCode') === 'kuaishou';
}
