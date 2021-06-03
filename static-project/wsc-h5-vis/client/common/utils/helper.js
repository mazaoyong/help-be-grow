// 移动端 ios 或者 微信端动态修改页面title
import ua from 'zan-utils/browser/ua';
import { action } from '@youzan/zan-jsbridge';
import * as SafeLink from '@youzan/safe-link';
import ZNB from '@youzan/znb';
// 是否百度小程序里的 webview

const kdtId = window._global.kdt_id || window._global.kdtId;

export const isSwan = window._global.miniprogram && window._global.miniprogram.isSwanApp;

if (isSwan) {
  ZNB.init({ kdtId });
}

export const setTitleHack = (title) => {
  document.title = title;
  if (ua.isIOS()) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    // 替换成站标favicon路径或者任意存在的较小的图片即可
    iframe.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAAAtJREFUCB1jYAACAAAFAAGNu5vzAAAAAElFTkSuQmCC');
    const iframeCallback = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', iframeCallback);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener('load', iframeCallback);
    document.body.appendChild(iframe);
  };
};

export const noop = function() {};

export const updateUrlWithStamp = (url, key) => {
  key = (key || 't') + '='; // 默认是"t"
  const reg = new RegExp(key + '\\d+'); // 正则：t=1472286066028
  const timestamp = +new Date();
  if (url.indexOf(key) > -1) { // 有时间戳，直接更新
    return url.replace(reg, key + timestamp);
  } else { // 没有时间戳，加上时间戳
    // eslint-disable-next-line
    if (url.indexOf('\?') > -1) {
      // eslint-disable-next-line
      const urlArr = url.split('\?');
      if (urlArr[1]) {
        return urlArr[0] + '?' + key + timestamp + '&' + urlArr[1];
      } else {
        return urlArr[0] + '?' + key + timestamp;
      }
    } else {
      if (url.indexOf('#') > -1) {
        return url.split('#')[0] + '?' + key + timestamp + window.location.hash;
      } else {
        return url + '?' + key + timestamp;
      }
    }
  }
};

export const importAllSvg = (r) => {
  return r.keys().map(r);
};

// 知识付费购买必须绑定手机号
// export const isMobileBinded = window._global.buyer_id || false;

export const centToYuan = (money) => {
  return (money / 100).toFixed(2);
};

export const jumpTo = (url) => {
  if (window._global.platform === 'youzanmars') {
    action.gotoWebview({
      page: 'web',
      url: url,
    });
  } else {
    SafeLink.redirect({
      url,
      kdtId: window._global.kdt_id,
    });
  }
};

// 根据关键词获取 UA 中的信息，用于数据统计
export function getUAKeyword(arr) {
  const ua = navigator.userAgent.toLowerCase().split(' ');
  let result = '';
  ua.forEach(uaPair => {
    arr.forEach(keyword => {
      if (uaPair.indexOf(keyword) !== -1) {
        result = uaPair;
      }
    });
  });

  return result;
}

// 是否为对象
export function isObj(x) {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

// 是否为空对象
export function isEmptyObject(obj) {
  return isObj(obj) && !Object.keys(obj).length;
}

// 是否未定义
function isDef(val) {
  return val !== null && val !== undefined;
}

export function get(object, path, defaultValue = {}) {
  if (!object) {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = object;

  keys.forEach(key => {
    result = isDef(result[key]) ? result[key] : {};
  });

  return isEmptyObject(result) ? defaultValue : result;
}

function escapereg(str) {
  return str.replace(new RegExp('([.*+?^=!:\x24{}()|[\\]/\\\\])', 'g'), '\\\x241');
};

export function delurlquery(url, key) {
  key = escapereg(key);
  var reg = new RegExp(`((\\?)(${key}=[^&]*&)+(?!${key}=))|(((\\?|&)${key}=[^&]*)+$)|(&${key}=[^&]*)`, 'g');
  return url.replace(reg, '\x241');
};

export function jumpToNativeLoginPage() {
  try {
    if (isSwan) {
      return ZNB.init().then(() => {
        return ZNB.navigate({
          url: `${_global.url.passport}/login/password?redirectUrl=${encodeURIComponent(location.href)}`,
          type: 'openWebView',
        });
      });
    }
  } catch (e) {
    console.log('跳转失败', e);
  }

  return Promise.reject();
}
