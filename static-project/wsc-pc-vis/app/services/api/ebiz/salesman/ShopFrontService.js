const BaseService = require('../../../base/BaseService');

/** com.youzan.salesman.center.application.api.setting.ShopFrontService -  */
class ShopFrontService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.salesman.center.application.api.setting.ShopFrontService';
  }

  /**
   *  查询店铺能力
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/510667
   *
   *  @param {Object} request -
   *  @param {string} request.retailSource - 零售调用来源
   *  @param {number} request.kdtId - 店铺kdtId
   *  @param {number} request.adminId - 操作人ID
   *  @return {Promise}
   */
  async getAbility(request) {
    return this.invoke('getAbility', [request]);
  }

  /**
   *  查询店铺开关
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/510668
   *
   *  @param {Object} request -
   *  @param {string} request.retailSource - 零售调用来源
   *  @param {number} request.kdtId - 店铺kdtId
   *  @param {number} request.adminId - 操作人ID
   *  @return {Promise}
   */
  async getSwitch(request) {
    return this.invoke('getSwitch', [request]);
  }

  /**
   *  是否在销售员商业化白名单中
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/515373
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async salesmanYopWhiteList(kdtId) {
    return this.invoke('salesmanYopWhiteList', [kdtId]);
  }
}

module.exports = ShopFrontService;
