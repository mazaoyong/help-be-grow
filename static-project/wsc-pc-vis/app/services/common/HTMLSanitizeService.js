const BaseService = require('../base/BaseService');
const get = require('lodash/get');

/**
 * 基于语法树的 HTML5 过滤服务
 * @see https://doc.qima-inc.com/pages/viewpage.action?pageId=14333333
 * @class HTMLSanitizeService
 * @extends {BaseService}
 */
class HTMLSanitizeService extends BaseService {
  /**
   * HTML 过滤，防蛀入
   *
   * @see https://doc.qima-inc.com/pages/viewpage.action?pageId=14333333
   * @param {string} text - 需要过滤的字符串
   * @returns {string} - 过滤后的字符串
   */
  async htmlSanitize(text) {
    const domail = this.getConfig('HTML_SANITIZE');

    const res = await this.httpCall({
      method: 'post',
      url: `${domail}/sanitize?
          element=1
          &attribute=2
          &style_property=1
          &style_property_value=1
          &url_protocol=1
          &url_domain=0
          &iframe_url_protocol=1
          &iframe_url_domain=1`,
      data: text,
      timeout: 10000,
      contentType: 'application/json',
    });

    return get(res, 'data');
  }

  /**
   * 富文本批量过滤
   *
   * @param {string} str - 数组字符串
   * @returns {string} - 数组字符串
   */
  async eachHtmlSanitize(str) {
    let obj = JSON.parse(str);

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

module.exports = HTMLSanitizeService;
