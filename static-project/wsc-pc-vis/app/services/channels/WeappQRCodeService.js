const { PCBaseService } = require('@youzan/wsc-pc-base');

/**
 * Project Base Service
 */
class WeappQRCodeService extends PCBaseService {
  /**
   * SERVICE_NAME
   *
   * @return {string}
   * @constructor
   */
  get SERVICE_NAME() {
    return 'com.youzan.channels.apps.service.WeappQRCodeService';
  }

  /**
   * 获取小程序码
   *
   * @see http://zanapi.qima-inc.com/site/service/view/155923
   * @param {number} kdtId - kdtId
   * @param {string} page
   * @param {Object} scene
   * @returns
   * @memberof WeappQRCodeService
   */
  async wxaGetCodeUnlimit(kdtId, page, scene) {
    const result = await this.invoke('wxaGetCodeUnlimit', [kdtId, page, scene]);
    return result;
  }

  /**
   * 获取无限小程序码
   *
   * @param {*} kdtId
   * @param {*} page
   * @param {Object} query query 的每个值都必须是字符串
   */
  async getCodeUltra(kdtId, page, query) {
    query = JSON.parse(query);
    Object.keys(query).forEach(key => {
      query[key] = String(query[key]);
    });
    const result = await this.invoke('wxaGetCodeUltra', [{ kdtId, page, params: query }]);
    return result;
  }
}

module.exports = WeappQRCodeService;
