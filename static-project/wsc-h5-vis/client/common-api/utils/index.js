import { ajax } from '@youzan/vis-ui';

/**
   * 前端上报数据
   */
export function postSkynetJson(data) {
  return ajax({
    url: 'https://h5.youzan.com/wscvis/knowledge/utils/skynetlog.json', // 下单页域名收敛为cashier域名，因此此处要绝对路径
    type: 'post',
    data,
    loading: false,
  });
}

/**
 * 获取公众号关注状态并返回公众号二维码
 */
export function getMpFollowStatus() {
  return ajax({
    url: '/wscvis/getMpFollowStatus.json',
    loading: false,
  });
}

export function getMpQrcode(data) {
  return ajax({
    url: `${_global.url.h5}/v2/weixin/scan/hosting.json`,
    method: 'POST',
    data,
    loading: false,
  });
}

/**
 * 获取公众号二维码列表，包含推送商品链接的二维码
 */
export function getMpQrcodeList(data) {
  return ajax({
    url: `/wscvis/getMpQrcode.json`,
    data,
    loading: false,
  });
}

// h5 二维码
export function getH5Qrcode(data) {
  return ajax({
    url: `/wscvis/common/qr/getQrcode.json`,
    data,
    loading: false,
  });
}

// 小程序二维码
export function getCommonWeappCode(data) {
  return ajax({
    url: '/wscvis/edu/getCommonWeappCode.json',
    data,
  });
}

// 小程序二维码
export function getCommonSwanCode(data) {
  return ajax({
    url: '/wscvis/edu/getCommonSwanCode.json',
    data,
  });
}

/**
 * 获取店铺小程序信息，若店铺没有小程序，则返回空对象
 */
export function getWeappInfo() {
  return ajax({
    url: '/wscvis/getWeappInfo.json',
    // loading: false,
  });
}

export function getColumnsPermission(alias) {
  return ajax({
    url: '/wscvis/course/detail/getAssetState.json',
    data: { alias },
  });
}
