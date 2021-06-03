import ajax from 'zan-pc-ajax';

// 获取是否lite网店管理员
export function checkIsLiteAdmin() {
  return ajax('/v4/trade/store/isLite.json', {
    method: 'GET',
  });
}

//  获取lite店铺信息
export function getLiteStoreList() {
  return ajax('/v4/trade/store/getLiteStoreList.json', {
    method: 'GET',
  });
}
