const BaseService = require('./DeliveryBaseService');

/** com.youzan.delivery.service.ElectronWayBillService */
class ElectronWayBillService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.delivery.service.ElectronWayBillService';
  }

  /**
   * 查询审核通过可用发货地址
   *
   * @param {Object} data
   * @param {number} data.expressId - 物流公司编号
   * @param {number} data.kdtId     - 店铺Id
   *
   * @typedef {Object} Address
   * @property {string} address      - 发货地址详细地址（不包含省市区）
   * @property {string} auditNo      - 审核单编号
   * @property {string} cityName     - 市
   * @property {string} countyName   - 区
   * @property {string} provinceName - 省
   *
   * @return {Promise.<Array.<Address>>}
   *
   * apiDoc: http://zanapi.qima-inc.com/site/service/view/86072
   */
  async queryAvailableAddress(data) {
    return this.invoke('queryAvailableAddress', [data]);
  }

  /**
   * 查询电子面单支持的快递公司
   *
   * @typedef {Object} ExpressCompany
   * @property {string}  expressName - 快递公司名称
   * @property {number}  expressId   - 快递公司编号
   * @property {boolean} isPay       - 是否需要支付
   * @property {number}  type        - 类型：1.电子面单 2.电子面单+上门取件
   *
   * @return {Promise.<Array.<ExpressCompany>>}
   *
   * apiDoc: http://zanapi.qima-inc.com/site/service/view/86078
   */
  async queryWaybillSupportExpress() {
    return this.invoke('queryWaybillSupportExpress', []);
  }

  /**
   * 查询快递公司对于支持的类型
   *
   * @param {number} expressId - 快递公司编号
   *
   * @return {Promise.<ExpressCompany>}
   *
   * apiDoc: http://zanapi.qima-inc.com/site/service/view/86072
   */
  async queryExpressType(expressId) {
    return this.invoke('queryExpressType', [{ expressId }]);
  }
}

module.exports = ElectronWayBillService;
