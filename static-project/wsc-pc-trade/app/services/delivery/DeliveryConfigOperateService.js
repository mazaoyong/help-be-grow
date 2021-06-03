const DeliveryBaseService = require('./DeliveryBaseService');

/**
 * 发货相关
 */
class DeliveryConfigOperateService extends DeliveryBaseService {
  /**
   * DeliveryConfigOperateService
   */
  get SERVICE_NAME() {
    return 'com.youzan.trade.dc.api.service.operate.DeliveryConfigOperateService';
  }

  /**
   * 更新发货配置
   * 文档：https://doc.qima-inc.com/pages/viewpage.action?pageId=53195902
   * @param {object} params
   */
  async updateConfig(params) {
    return this.invoke('modifyConfig', [params]);
  }
}

module.exports = DeliveryConfigOperateService;
