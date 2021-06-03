import YZLocalStorage from 'zan-utils/local_storage';
import Args from 'zan-utils/url/args';
import Webpinfo from '../utils/webpinfo';

let Logger = {};
const fp = YZLocalStorage.getItem('fp');
const getLastSpm = () => window._global.spm.logType + window._global.spm.logId || `fake${window._global.kdt_id}`;

window._global.spm = window._global.spm || {};

const trim = function(str) {
  return str == null ? '' : String.prototype.trim.call(str);
};

const _getSpm = (() => {
  return () => {
    let spm = Args.get('spm');
    spm = trim(spm);
    if (spm !== '') {
      const arr = spm.split('_');
      if (arr.length > 2) {
        spm = `${arr[0]}_${arr[arr.length - 1]}`;
      }
      spm += `_${getLastSpm()}`;
    } else {
      spm = getLastSpm();
    }
    return spm;
  };
})();

const _doLog = (url, params) => {
  let img = new window.Image();
  const random = Math.floor(Math.random() * 2147483648).toString(36);
  const key = `log_${random}`;
  const promise = new Promise((resolve, reject) => {
    // 这里一定要挂在window下
    // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
    // 导致服务器收不到日志
    window[key] = img;

    img.onload = img.onerror = img.onabort = () => {
      // 下面这句非常重要
      // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
      // 则在gif动画播放过程中，img会多次触发onload
      // 因此一定要清空
      img.onload = img.onerror = img.onabort = null;

      window[key] = null;

      // 下面这句非常重要
      // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
      // 因此这里一定要置为null
      img = null;
      resolve();
    };

    // 一定要在注册了事件之后再设置src
    // 不然如果图片是读缓存的话，会错过事件处理
    // 最后，对于url最好是添加客户端时间来防止缓存
    // 同时服务器也配合一下传递Cache-Control: no-cache;
    // 单页应用手动传入link
    params.link = params.link || window.location.href;
    params.time = new Date().getTime();

    // 设备指纹，数据组要求添加，在cookie不存 or 被清空的情况下识别用户
    if (fp) {
      params.fp = fp;
    }

    img.src = Args.add(url, params);
    // 设置1.5秒内发送请求
    window.setTimeout(resolve(), 1500);
  });
  return promise;
};

// 获取请求地址
const getTarget = (target) => {
  target = target || 'default';
  const targetMap = {
    'wxd': '//tj.youzan.com/fx.gif',
    'wxdapp': '//app-tj.youzan.com/1.gif',
    'default': '//tj.youzan.com/1.gif',
    'ua': '//tj.youzan.com/v1/ua',
  };
  return targetMap[target];
};

const logs = window.__logs;

if (logs && logs.length > 0) {
  logs.forEach(Logger.log);
}

Logger = {
  getSpm() {
    if (!Logger.spm) Logger.spm = _getSpm();
    return Logger.spm;
  },
  // 用于单页应用重新设置spm对象
  setSpm() {
    if (!Logger.spm) {
      Logger.spm = _getSpm();
    } else {
      let spm = Logger.spm;
      if (spm !== '') {
        const arr = spm.split('_');
        if (arr.length > 2) {
          spm = `${arr[0]}_${arr[arr.length - 1]}`;
        }
        spm += `_${getLastSpm()}`;
      } else {
        spm = getLastSpm();
      }
      Logger.spm = spm;
    }
  },
  log(params, cb) {
    if (!params.spm) params.spm = Logger.getSpm(); // 补全日志spm
    if (!params.referer_url) params.referer_url = encodeURIComponent(document.referrer); // eslint-disable-line
    if (!params.title) params.title = window._global.title || trim(document.title);
    const target = getTarget(params.target);
    delete params.target;
    return _doLog(target, params).then(cb);
  },
  uaLog() {
    _doLog(getTarget('ua'), Webpinfo);
  },
};

window.Logger = Logger;

export default Logger;
