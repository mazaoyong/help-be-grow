const queryString = require('qs');
const lodash = require('lodash');
const xss = require('xss');
const SanitizeService = require('../services/sanitize/SanitizeService');

/**
 * 工具方法，向vislogger注入更多信息
 *
 * @param {*} context ctx上下文
 * @param {*} params log params
 */
const appendParams = (context, params) => {
  const {
    kdtId, userId, originalUrl, headers = {}, firstXff, body, acceptJSON, traceCtx = {},
  } = context;

  const rootId = traceCtx.rootId;

  const originType = !acceptJSON ? '来自页面' : '来自接口';

  let [msg, e, extra] = params || [];

  const { mobile } = context.getLocalSession('userInfo') || {};

  const traceId = context.getCookie('yz_log_uuid') || context.getState('yzLogUuid') || '';

  // 只接受string
  msg = JSON.stringify({
    rootId,
    kdtId,
    userId,
    mobile,
    msg,
    originalUrl,
    firstXff,
    referer: headers['referer'],
    originType,
    eduTraceId: traceId,
  });

  extra = {
    extra,
    body,
    rootId,
    kdtId,
    userId,
    mobile,
    eduTraceId: traceId,
    uuid: traceId
  };
  return [msg, e, extra];
};

/**
 * 扩展 Koa Context 对象
 */
module.exports = {
  get visLogger() {
    return {
      info: (...params) => {
        return this.logger.info(...appendParams(this, params));
      },
      warn: (...params) => {
        return this.logger.warn(...appendParams(this, params));
      },
      debug: (...params) => {
        return this.logger.debug(...appendParams(this, params));
      },
      error: (...params) => {
        return this.logger.error(...appendParams(this, params));
      },
    };
  },

  /**
   * getQueryData 模块在解析 zan-pc-ajax 的 query 请求的时候
   * 会在 key 里面把数组的方括号带上，并且做一个很奇怪的union动作
   *
   * 例如 querystring = baz=biz&foo[]=bis&foo[]=test&arr[]=1&arr[]=1 这样的请求
   *
   * @param {string} key query key
   * @return {Record<string, any> | unknown} query
   */
  getQueryParse(key) {
    try {
      const originUrl = this.request.url;
      const queriesStr = originUrl.split('?')[1];
      const parsed = queryString.parse(queriesStr, { arrayLimit: 200 });
      return key ? lodash.get(parsed, key) : parsed;
    } catch (err) {
      console.error(err);
    }
    return key ? undefined : {};
  },

  /**
   * @param {string} key
   * @override
   */
  getQueryData(key) {
    return this.getQueryParse(key);
  },

  /**
   * 手动xss过滤方法,所有加了astroboy-security-xss白名单的接口，需要手动调用这个方法过滤
   * Copy from astroboy-security-xss middleware
   *
   * @param {*} value 要过滤的目标对象或数组
   * @param {*} deep 是否深度递归过滤
   * @return {*}
   */
  deepXss(value, deep = true) {
    let res;

    if (Array.isArray(value) && value.length > 0) {
      res = [];
    } else if (lodash.isPlainObject(value) && Object.keys(value).length > 0) {
      res = {};
    } else {
      if (typeof value === 'string') {
        return xss(value.trim());
      }
      return value;
    }

    return lodash.reduce(value, (result, val, key) => {
      if (deep) {
        val = this.deepXss(val);
      }
      result[key] = val;
      return result;
    }, res);
  },

  /**
   * xss方便过滤器
   *
   * @param {Object} data 待过滤数据
   * @param {string | Array} htmlFilterKey 数组或字符串
   * @param {string} funcName 指定sanitizeService 方法
   * @return {Object} object
   */
  async visXss(data, htmlFilterKey = [], funcName = 'htmlSanitize') {
    const temp = {};
    const sanitizeService = new SanitizeService(this);
    const sanitizeFun = sanitizeService[funcName].bind(sanitizeService);

    if (lodash.isString(htmlFilterKey)) {
      htmlFilterKey = [htmlFilterKey];
    }
    // 摘出来过滤
    await Promise.all(htmlFilterKey.map(key => {
      return sanitizeFun(lodash.get(data, key, ''))
        .then(ret => {
          temp[key] = ret;
        });
    }));

    // deepxss
    data = this.deepXss(data);
    // 塞回去
    htmlFilterKey.map(key => {
      lodash.set(data, key, temp[key]);
    });

    return data;
  },

  /**
   * xss过滤微页面
   *
   * @param {Object} data 待过滤数据
   * @param {string} htmlFilterKey 属性
   * @param {string} funcName 指定sanitizeService 方法
   * @return {Object} object
   */
  async vixMicroPageXss(data, htmlFilterKey = '', funcName = 'htmlSanitize') {
    const sanitizeService = new SanitizeService(this);
    const sanitizeFun = sanitizeService[funcName].bind(sanitizeService);
    const originalValue = lodash.get(data, htmlFilterKey, '');
    try {
      const formattedValues = JSON.parse(originalValue);
      if (Array.isArray(formattedValues)) {
        return Promise.all(formattedValues.map((item) => {
          if (item.type === 'rich_text') {
            return (function(_item) {
              return sanitizeFun(item.content).then(res => {
                _item.content = res;
              });
            })(item);
          } else {
            return null;
          }
        })).then(_ => {
          lodash.set(data, htmlFilterKey, JSON.stringify(formattedValues));
          return data;
        });
      } else {
        throw new Error();
      }
    } catch (e) {
      throw new Error(e);
    }
  },
};
