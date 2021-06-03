const BaseService = require('../../base/BaseService');

/**
 * com.youzan.ic.manage.api.ShopConfigService -
 */
class ShopConfigService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ic.manage.api.ShopConfigService';
  }

  /**
   * @description 保存库存配置
   * @see http://zanapi.qima-inc.com/site/service/view/458358
   * @param {Object} param -
   * @param {string} param.stockModel - "1"：开启独立库存 "0":  关闭独立库存 →  是共享库存
   * @param {string} param.fromApp - 请求来源
   * @param {number} param.hqKdtId - 总店店铺ID
   * @param {string} param.requestId - UUID
   * @param {number} param.subKdtId - 分店店铺ID
   * @param {Object} param.operator - 操作人信息
   * @return {Promise}
   * @return {Promise}
   */
  async saveStockConfig(param) {
    return this.invoke('saveStockConfig', [param]);
  }
}

module.exports = ShopConfigService;
