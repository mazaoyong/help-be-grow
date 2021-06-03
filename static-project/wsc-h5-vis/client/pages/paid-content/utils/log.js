import Args from 'zan-utils/url/args';
import 'common/log/pageLogger';
import { BURING_POINT_MAP, PAGE_TYPE_MAP } from 'pct/constants';
import apis from 'pct/api';

export function getDefaultLog(pageName) {
  const needHandLog = ['content-show', 'column-show', 'live-detail', 'live-room'];
  const log = { auto: true, type: BURING_POINT_MAP[pageName] || 'fake' };
  if (needHandLog.indexOf(pageName) > -1) {
    log.auto = false;
    log.id = function() {
      return apis.getGoodsId({
        alias: this.$params.alias,
        type: PAGE_TYPE_MAP[pageName],
      });
    };
  }
  return log;
}

const trim = function(str) {
  return str == null ? '' : String.prototype.trim.call(str);
};

// 根据路由名设置对应的埋点信息
export const setBuringPoint = (type, logId) => {
  window._global.spm = {
    logType: type in BURING_POINT_MAP ? BURING_POINT_MAP[type] : 'fake',
    logId,
  };

  const pctSpmList = [];
  const prePctSpm = window._global.pctSpm;
  let source = '';
  let referrer = '';
  const current = (type in BURING_POINT_MAP ? BURING_POINT_MAP[type] : 'fake') + logId;

  let prePctSpmList = [];
  if (prePctSpm) prePctSpmList = prePctSpm.split('_');
  switch (prePctSpmList.length) {
    case 3:
      source = prePctSpmList[0];
      referrer = prePctSpmList[2];
      break;
    case 2:
      source = prePctSpmList[0];
      referrer = prePctSpmList[1];
      break;
    case 1:
      source = prePctSpmList[0];
      break;
    default:
      break;
  }

  let spm = Args.get('spm');
  spm = trim(spm);
  let spmList = [];
  if (spm) spmList = spm.split('_');
  if (!source && spmList.length) source = spmList[0];
  if (!referrer && spmList.length > 1) referrer = spmList.length > 2 ? spmList[2] : spmList[1];

  if (source) pctSpmList.push(source);
  if (referrer) pctSpmList.push(referrer);
  pctSpmList.push(current);
  window._global.pctSpm = pctSpmList.join('_');

  // 更改页面 url，防止跳出单页应用时 spm 丢失
  // url 中 spm 只需要记录 source、referrer
  // const urlSpm = pctSpmList.slice(0, (pctSpmList.length > 2 ? 2 : 1)).join('_');
  // window.history && window.history.replaceState && window.history.replaceState(
  //   { spm: urlSpm },
  //   '',
  //   Args.add(window.location.href, { spm: urlSpm })
  // );

  return window._global.pctSpm;

  // 埋点需求， 在_global.spm 添加对应路由的logType
  // window.Logger.setSpm();
};

export const makeLog = ({ name, id, link, title, alias }) => {
  new Promise((resolve, reject) => {
    if (id) {
      resolve(id);
      return;
    }
    apis.getGoodsId({
      alias,
      type: PAGE_TYPE_MAP[name],
    })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  })
    .then(logId => {
      return setBuringPoint(name, logId);
    })
    .then((spm) => {
      const logReferrer = window.log_referrer === location.href ? '' : window.log_referrer;

      const enterTime = new Date().getTime();
      const rurl = logReferrer || document.referrer || '';
      window.yzlogInstance && window.yzlogInstance.log({
        et: 'display',
        ei: 'enterpage',
        en: document.title,
        ts: enterTime || '',
        params: {
          rurl,
          spm,
        },
      });
    })
    .catch(err => {
      console.warn('makeLog', err);
    });
  /* eslint-disable */
  // window.Logger.log({
  //   fm: 'display',
  //   link: makeUrlLog(link),
  //   act_name: 'unknown',
  //   act_ver: window._global.page_version || 'unknown',
  //   platform: window._global.platform
  // });
  // window.Logger.uaLog();
}

// 手动触发一个简单的埋点
export const makeSimpleLog = (type, logOptions = {}) => {
  const options = {
    et: 'click', // 事件类型,
    ei: '', // 事件标识
    en: '', // 事件名称
    pt: type in BURING_POINT_MAP ? BURING_POINT_MAP[type] : type, // 页面类型
    pi: '', // 页面业务id
    params: {}, // 事件参数
    ...logOptions,
  };

  const logReferrer = window.log_referrer === location.href ? '' : window.log_referrer;
  options.params.logReferrer = logReferrer;

  const logger = window.yzlogInstance;
  logger && logger.log(options);
};
