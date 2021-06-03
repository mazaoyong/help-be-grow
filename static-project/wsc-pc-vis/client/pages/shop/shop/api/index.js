import { visAjax } from 'fns/new-ajax';

// 店名校验
export function checkShopName(data) {
  return visAjax('GET', '/edu/shop/checkShopName.json', data);
}

// edu类目
export function getEduCategory(data) {
  return visAjax('GET', '/edu/shop/eduCategory.json', data);
}

// 可选升级店铺列表
export function queryModifiableShops(data) {
  return visAjax('GET', '/edu/shop/queryModifiableShops.json', data);
}

// 查询店铺中是否有未下架的实物商品
export function getOnSellGoods(data) {
  return visAjax('GET', '/edu/shop/getOnSellGoods.json', data);
}

// 创建店铺
export function createEduShop(data) {
  return visAjax('POST', '/edu/shop/createEduShop.json', data);
}

// 店铺升级提交
export function upgradeToEduShop(data) {
  return visAjax('POST', '/edu/shop/upgradeToEduShop.json', data);
}

// 获取验证码（deprecated，请使用下面）
export function sendSmsCaptcha(data) {
  return visAjax('GET', '/edu/shop/sendSmsCaptcha.json', data);
}

// 获取验证码，增加行为组件校验
export function sendBehaviorCaptchaJson(data) {
  return visAjax('GET', '/edu/shop/sendBehaviorCaptchaJson.json', data);
}

// 创建教育总部
export function createEduHQ(data) {
  return visAjax('POST', '/edu/shop/createEduHQ.json', data);
}

// 获取二维码
export function getQrcode(url, options) {
  return visAjax('GET', '/edu/shop/getWscQrcode.json', {
    url: url,
    width: 280,
    height: 280,
    ...options,
  });
}
