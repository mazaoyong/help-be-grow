import ajax from 'zan-pc-ajax';

// 获取同城能力服务
export function getSameCityCap() {
  return ajax('/v4/trade/delivery/sameCityCap.json', {
    method: 'GET',
  });
}

// 获取快递服务
export function getExpressCap() {
  return ajax('/v4/trade/delivery/expressCap.json', {
    method: 'GET',
  });
}
