// 有赞云全局数据初始化
import { init, getBridge } from '@youzan/youzanyun-bridge';
import { getThemeColor } from '@youzan/vue-theme-plugin';

const _global = window._global || {};

init(window, {
  appName: 'wsc-h5-vis',
});
const bridge = getBridge();

// 全局用户信息
export function setUserInfo() {
  const buyer = _global.buyer || {};
  const yzUser = _global.yz_user || {};

  bridge.setData('user', {
    gender: buyer.gender || '',
    avatar: yzUser.avatar || '',
    mobile: yzUser.mobile || '',
    nickName: yzUser.nickname || '',
    userOpenId: _global.user_open_id || '',
  });
}

// 全局店铺信息
export function setShopInfo() {
  bridge.setData('shop', {
    kdtId: _global.kdt_id || 0,
  });
}

// 店铺全店风格
export function setThemeInfo() {
  bridge.setData('theme', {
    general: getThemeColor('main'),
    mainBgColor: getThemeColor('main'),
    mainTextColor: getThemeColor('mainText'),
    viceBgColor: getThemeColor('vice'),
    viceTextColor: getThemeColor('viceText'),
  });
}

export function initGlobalBridge() {
  try {
    setUserInfo();
    setShopInfo();
    setThemeInfo();
  } catch (error) {}
}

initGlobalBridge();
