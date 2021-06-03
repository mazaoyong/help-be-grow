const BaseService = require('../../base/BaseService');

/** com.youzan.shopcenter.outer.service.shop.ShopCreateOuterService -  */
class ShopCreateOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.shop.ShopCreateOuterService';
  }

  /**
   *  创建微商城教育版店铺
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/218803
   *
   *  @param {Object} request
   *  @param {Object} request.address - 地址
   *  @param {string} request.appName - 调shop-center应用名称(调用方在ops平台登记的应用名)
   *  @param {number} request.businessId - 主营商品类目id
   *  @param {string} request.ipAddress - 操作入口来源ip地址
   *  @param {string} request.shopName - 店铺名称
   *  @param {number} request.fromTerminal - 来源终端类型：0 PC，1 APP，2 PAD，3 微信小程序，4 H5；默认0
   *  @param {string} request.entryAppName - 入口appName(调用方在ops平台登记的应用名)
   *  @param {string} request.requestId - 请求id
   *  @param {string} request.intro - 简介
   *  @param {string} request.logo - logo
   *  @param {number} request.fromBiz - 来源业务：1 有赞，2 分销；默认1
   *  @param {number} request.operatorType - 操作人帐号类型：1 卖家，2 内部员工cas id，3 未知，4 系统行为（如监听NSQ并主动修改数据）
   *  @param {number} request.operatorId - 操作人帐号id
   *  @return {Object}
   */
  async createWscEduShop(request) {
    return this.invoke('createWscEduShop', [request]);
  }
}

module.exports = ShopCreateOuterService;
