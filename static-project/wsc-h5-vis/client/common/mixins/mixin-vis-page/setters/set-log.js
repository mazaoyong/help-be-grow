import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

export function log(logConfig, action = 'enterpage', params = {}) {
  const { type = 'fake', presets = {} } = logConfig;
  const logger = window.yzlogInstance;

  if (!logger) {
    return;
  }

  let id = logConfig.id || window._global.kdt_id;
  if (isFunction(id)) id = id.apply(this);

  return Promise.all([id])
    .then(([id]) => {
      window._global.spm = {
        logType: type,
        logId: id,
      };

      const logReferrer = window.log_referrer === location.href ? '' : window.log_referrer;
      const enterTime = new Date().getTime();
      const rurl = logReferrer || document.referrer || '';

      // 兼容之前的enterpage埋点
      if (action === 'enterpage') {
        logger.log({
          et: 'display',
          ei: 'enterpage',
          en: document.title,
          ts: enterTime,
          params: {
            rurl,
            ...params,
          },
        });
      } else if (isObject(presets[action])) {
        logger.log({
          et: 'click',
          ei: 'fake',
          en: document.title,
          ts: enterTime,
          pi: `${id}`,
          pt: type,
          params,
          ...presets[action],
        });
      } else {
        // eslint-disable-next-line no-console
        console.warn(`未知的埋点：${action}`);
      }

      // 记录 referrer
      window.log_referrer = location.href;

      // 把拿到的goodsId返回出去
      return id;
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
}

function setLogId(id) {
  const logOption = this.$options.config.log;
  if (isObject(logOption)) {
    logOption.id = id;
  } else {
    this.$options.config.log = {
      auto: false,
      id: id,
    };
  }
}

export default function setLog(vm, { config: { log: logConfig = {} } = {} }) {
  vm.$log = log.bind(vm, logConfig);
  vm.$setLogId = setLogId.bind(vm);
}
