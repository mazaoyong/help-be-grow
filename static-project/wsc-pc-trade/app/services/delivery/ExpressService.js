const DeliveryBaseService = require('./DeliveryBaseService');

/**
 * 发货相关
 */
class ExpressService extends DeliveryBaseService {
  /**
   * DeliveryConfigOperateService
   */
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.ExpressService';
  }

  /**
   *  获取快递公司的列表 id->name
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/19269
   *
   *  @return {object}
   */ async getExpressList() {
    return this.invoke('getExpressList', []);
  }

  /**
   *  获取快递公司的列表,分别包括推荐物流、按首字母分组、常用物流
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/139415
   *
   *  @param {string} kdtId -
   *  @return {Promise}
   */
  async getExpressShowList(kdtId) {
    return this.invoke('getExpressShowList', [kdtId]);
  }
}

module.exports = ExpressService;
