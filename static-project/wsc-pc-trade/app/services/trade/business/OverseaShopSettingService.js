const BusinessBaseService = require('./BusinessBaseService');

/**
 * @typedef {import('definitions/cross-border').ICheckApplyResult} ICheckApplyResult
 */

/**
 * 跨境服务相关
 */
class OverseaShopSettingService extends BusinessBaseService {
  /**
   * service name
   */
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.oversea.OverseaShopSettingService';
  }

  /**
   *  查询店铺海淘跨境开关是否开启
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/323190
   *
   *  @param {Object} requestDTO -
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @return {Promise}
   */
  async query(requestDTO) {
    return this.invoke('query', [requestDTO]);
  }

  /**
   *  申请退出跨店海淘跨境服务
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/323191
   *
   *  @param {Object} requestDTO -
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @return {Promise}
   */
  async applyQuit(requestDTO) {
    return this.invoke('applyQuit', [requestDTO]);
  }

  /**
   *  申请入驻条件检查
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/326336
   *
   *  @param {Object} requestDTO -
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @return {Promise<ICheckApplyResult>}
   */
  async checkApplyEntry(requestDTO) {
    return this.invoke('checkApplyEntry', [requestDTO]);
  }
}

module.exports = OverseaShopSettingService;
