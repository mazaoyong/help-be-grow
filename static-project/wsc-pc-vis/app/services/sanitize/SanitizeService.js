// HTML 过滤，防蛀入
const BaseService = require('../base/BaseService');
const querystring = require('querystring');

const htmlQuery = querystring.stringify({
  element: 1,
  attribute: 2,
  style_property: 1,
  style_property_value: 1,
  url_protocol: 1,
  url_domain: 0,
  iframe_url_protocol: 1,
  iframe_url_domain: 1,
});

/**
 * HTML XSS 过滤
 */
class SanitizeService extends BaseService {
  /**
   * 富文本过滤
   *
   * @see https://doc.qima-inc.com/pages/viewpage.action?pageId=14333333
   * @param {number} text - 要过滤的 html 字符串
   * @return {Promise.<string>} 返回过滤后的html
   * @memberof ExportRecordsService
   */
  async htmlSanitize(text = '') {
    // 空字符串居然会报错，简直不可思议的实现
    if (!(text.trim())) return Promise.resolve(text);
    const domail = this.ctx.getConfig('HTML_SANITIZE');
    return this.ajax({
      method: 'POST',
      url: `${domail}/sanitize?${htmlQuery}`,
      data: text,
      timeout: 10000,
      contentType: 'application/json',
    }).then(ret => ret.toString());
  }

  /**
   * design 组件内容过滤
   *
   * @param {string} str - design 文本
   * @return string
   */
  async designSanitize(text) {
    let obj = JSON.parse(text);

    obj = await Promise.all(
      obj.map(item => {
        return new Promise(async (resolve, reject) => {
          try {
            if (item.content) {
              item.content = await this.htmlSanitize(item.content);
            }
          } catch (err) {
            reject(err);
          }
          resolve(item);
        });
      })
    );

    return JSON.stringify(obj);
  }
}

module.exports = SanitizeService;
