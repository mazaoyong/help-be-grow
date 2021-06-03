const BaseService = require('../base/BaseService');

class WeappQRCodeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.channels.apps.service.WeappQRCodeService';
  }

  get CHAIN_FACADE_SERVICE() {
    return 'com.youzan.uic.channel.business.api.service.WxWeappQRCodeService';
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

  /**
   * 获取无限小程序码(新接口，适配连锁分店)
   *
   * @param {*} kdtId
   * @param {*} page
   * @param {Object} query query 的每个值都必须是字符串
   */
  async getChainCodeUltra(kdtId, page, query) {
    query = JSON.parse(query);
    const hyaLine = !!query.hyaLine;
    Object.keys(query).forEach(key => {
      query[key] = String(query[key]);
    });
    const result = await this.invoke(this.CHAIN_FACADE_SERVICE, 'wxaGetCodeUltra', [{ kdtId, page, params: query, hyaLine }]);
    return result;
  }
}

module.exports = WeappQRCodeService;
