/**
 * 扩展 Koa Context 对象
 */
const prettyjson = require('prettyjson');
const queryString = require('qs');
const lodash = require('lodash');
const { join, resolve } = require('path');
const { readFileSync } = require('fs');
const Vue = require('vue');
const { createRenderer } = require('vue-server-renderer');

const ENV = process.env.NODE_ENV;

/**
 * 工具方法，向vislogger注入更多信息
 *
 * @param {*} context ctx上下文
 * @param {*} params log params
 */
const appendParams = (context, params) => {
  const {
    kdtId, buyerId, originalUrl, firstXff, body, headers = {},
    acceptJSON, mobileSystem, platform, platformVersion, traceCtx = {},
  } = context;

  const {
    buyer = {},
  } = context.getLocalSession();

  const originType = !acceptJSON ? '来自页面' : '来自接口';

  const rootId = traceCtx.rootId;

  const mobile = buyer.mobile || '';

  const eduTraceId = context.getCookie('yz_log_uuid') || context.getState('yzLogUuid') || '';

  const platformInfo = { mobileSystem, platform, platformVersion };

  let [msg, e, extra] = params || [];

  // 只接受string
  msg = JSON.stringify({
    rootId,
    kdtId,
    userId: buyerId,
    mobile,
    eduTraceId,
    msg,
    originalUrl,
    originType,
    referer: headers['referer'],
    firstXff,
    platformInfo,
  });

  extra = {
    extra,
    body,
    rootId,
    uuid: eduTraceId,
    app: 'wsc-h5-vis',
    kdtId,
    userId: buyerId,
    mobile,
  };
  // fix: some obj stringfy error

  return [msg, e, extra];
};

module.exports = {
  // 返回 url 列表
  get appUrl() {
    const host = lodash.get(this, 'headers.host') || 'h5.youzan.com';
    return {
      vis: `https://${host}/wscvis`,
    };
  },

  /**
   * getQueryData 模块在解析 zan-pc-ajax 的 query 请求的时候
   * 会在 key 里面把数组的方括号带上，并且做一个很奇怪的union动作
   *
   * 例如 querystring = baz=biz&foo[]=bis&foo[]=test&arr[]=1&arr[]=1 这样的请求
   *
   * @param {string} key
   * @return
   */
  getQueryParse(key) {
    const str = this.querystring;
    const parsed = queryString.parse(str);
    return key ? lodash.get(parsed, key) : parsed;
  },

  get visBuyer() {
    const {
      buyer = {},
      fans_id: fansId = 0,
      fans_type: fansType = 0,
      youzan_fans_id: youzanFansId = 0,
      fans_nickname: fansNickname = '',
      fans_picture: fansPicture = '',
      verify_weixin_openid: openId,
      platform = {},
      user = {},
    } = this.getLocalSession();

    return {
      nobody: '',
      buyerId: this.buyerId,
      buyerPhone: buyer.mobile || '',
      fansId,
      youzanFansId,
      fansType,
      fansNickname, // 第三方体系下的用户名（微信
      fansPicture, // 第三方体系下的头像（微信
      buyerNickname: buyer.nick_name || '', // 有赞体系下的用户名（手机号登录
      buyerPicture: buyer.avatar || '', // 有赞体系下的头像（手机号登录
      openId,
      platform,
      user,
      // 聚合字段：统一从这两个字段取头像和用户名，确保对前端统一
      // https://doc.qima-inc.com/pages/viewpage.action?pageId=103221541
      finalAvatar: platform.platform_avatar || user.avatar || '',
      finalUsername: platform.platform_nickname || user.nickname || '',
    };
  },

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

  get logUserStr() {
    const {
      finalUsername: username, finalAvatar: avatar, fansId, fansType, buyerPhone, nobody: sessionId,
    } = this.visBuyer;
    return `kdtId: ${this.kdtId} buyerId: ${this.visBuyer.buyerId} username: ${username} avatar: ${avatar} fansId: ${fansId} fansType: ${fansType} phone: ${buyerPhone} sessionId: ${sessionId}`;
  },

  /**
   * 用于开发环境格式化 json 对象
   *
   * @param {Object} json
   */
  prettyjson(json) {
    const isPrd = ENV === 'prod' || ENV === 'pre';

    // 预发和生产环境过滤非 error 等级的 log
    if (isPrd) {
      return json;
    }

    // 若传入的 level 不合法，默认使用 log 方法
    try {
      return prettyjson.render(json);
    } catch (err) {
      return json;
    }
  },

  get isGuang() {
    const tpps = this.cookies.get('tpps') || '';
    const REG = /^pf\./;
    const platformSource = REG.test(tpps) ? tpps.replace(REG, '') : '';
    return platformSource === 'GUANG';
  },

  async renderVuePoster(pathname = '', data = {}) {
    if (!pathname) return '必须指定海报模板路径';

    let html = '';
    const posterDirPath = '../views/common/poster/vue/';
    const htmlName = 'template.html';
    const jsName = 'main.js';

    try {
      const dirPath = resolve(__dirname, posterDirPath, pathname);
      const templatePath = join(dirPath, htmlName);
      const template = readFileSync(templatePath, { encoding: 'utf-8' });
      const renderer = createRenderer({
        template,
      });
      const componentPath = join(dirPath, jsName);
      if (['qa', 'development'].indexOf(process.env.NODE_ENV) > -1 &&
        require.cache[componentPath]
      ) {
        delete require.cache[componentPath];
      }
      const componentOptions = require(componentPath).default;
      const Ctor = Vue.extend(componentOptions);
      const component = new Ctor({
        propsData: data,
      });
      html = await renderer.renderToString(component);
    } catch (err) {
      this.visLogger.warn('Vue海报渲染错误', err);
    }
    return html;
  },
};
