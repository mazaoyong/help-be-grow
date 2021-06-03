const BaseService = require('../../base/BaseService');

/* com.youzan.shopcenter.outer.service.chain.EduChainCreateOuterService -  */
class EduChainCreateOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.chain.EduChainCreateOuterService';
  }

  /**
   *  创建有赞教育总部
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/411257
   *
   *  @param {Object} request - {@link EduHqCreateRequest}
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
   *  @return {Promise}
   */
  async createEduHQ(request) {
    return this.invoke('createEduHQ', [request]);
  }

  /**
   *  创建有赞教育校区
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/411258
   *
   *  @param {Object} request - {@link EduSubShopCreateRequest}
   *  @param {Object} request.address - 地址
   *  @param {string} request.managerCountryCode - 负责人国家码
   *  @param {number} request.hqKdtId - 总部店铺kdtId
   *  @param {string} request.appName - 调shop-center应用名称(调用方在ops平台登记的应用名)
   *  @param {number} request.businessId - 主营商品类目id
   *  @param {string} request.ipAddress - 操作入口来源ip地址
   *  @param {string} request.shopName - 店铺名称
   *  @param {number} request.fromTerminal - 来源终端类型：0 PC，1 APP，2 PAD，3 微信小程序，4 H5；默认0
   *  @param {number} request.partnerKdtId - 父店铺kdtId
   *  @param {string} request.managerName - 负责人名称
   *  @param {Object} request.businessHoursSetting - 营业时间
   *  @param {string} request.customerServicePhoneNumber - 客服电话
   *  @param {string} request.customerServiceAreaCode - 客服电话区号
   *  @param {string} request.entryAppName - 入口appName(调用方在ops平台登记的应用名)
   *  @param {string} request.requestId - 请求id
   *  @param {number} request.joinType - 加盟类型
   *  @param {string} request.managerMobileNumber - 负责人手机号码
   *  @param {string} request.intro - 简介
   *  @param {Object} request.funcConfigs - 功能配置
   *  @param {string} request.logo - logo
   *  @param {number} request.fromBiz - 来源业务：1 有赞，2 分销；默认1
   *  @param {number} request.operatorType - 操作人帐号类型：1 卖家，2 内部员工cas id，3 未知，4 系统行为（如监听NSQ并主动修改数据）
   *  @param {number} request.operatorId - 操作人帐号id
   *  @return {Promise}
   */
  async createSubShop(request) {
    return this.invoke('createSubShop', [request]);
  }
}

module.exports = EduChainCreateOuterService;
