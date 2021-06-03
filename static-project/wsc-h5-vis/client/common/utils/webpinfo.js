'use strict';
var UA = require('zan-utils/browser/ua');
var cookie = require('zan-utils/browser/cookie');
var WEBP_UNKNOW = 2;
var WEBP_NO = 1;
var WEBP_YES = 0;
/**
 * 获取浏览器是否支持webp
 * 读取cookie中和localstorage中canwebp的字段
 */
function canWebp() {
  // 先通过cookie判断
  if (parseInt(cookie('_canwebp'), 10) === 1) {
    return WEBP_YES;
  } else if (parseInt(cookie('_canwebp'), 10) === 2) {
    return WEBP_NO;
  }

  var webpFlag;
  if (window.localStorage) {
    try {
      // 没有cookie再查询一下localstorage
      if (localStorage.getItem('canwebp') === 'ok') {
        webpFlag = WEBP_YES;
      } else if (localStorage.getItem('canwebp') === 'no') {
        webpFlag = WEBP_NO;
      }
    } catch (e) {
      webpFlag = WEBP_UNKNOW;
    }
  }

  return webpFlag;
}

function getBrowser() {
  if (UA.isWeixin()) {
    return 'weixin';
  }

  if (UA.isWxd()) {
    return 'wxd';
  }

  if (UA.isUC()) {
    return 'uc-' + UA.getUCVersion();
  }

  if (UA.isChrome()) {
    return 'chrome-' + UA.getChromeVersion();
  }

  if (UA.isSafari()) {
    return 'safari-' + UA.getSafariVersion();
  }

  return 'unknow';
}

function getSystem() {
  if (UA.isIOS()) {
    return 'ios-' + UA.getIOSVersion();
  }

  if (UA.isAndroid()) {
    return 'android-' + UA.getAndroidVersion();
  }
}

export default {
  canWebp: canWebp(),
  browser: getBrowser(),
  system: getSystem(),
};
