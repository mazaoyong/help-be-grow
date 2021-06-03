
const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.shop.ChainShopConfigFacade */
class ChainShopConfigFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.shop.ChainShopConfigFacade';
  }

  /**
     * 更新教育校区的信息
     *
     * @see http://zanapi.qima-inc.com/site/service/view/983724
     * @param {Object} request - 有赞教育校区更新请求
     * @param {Object} request.address - 地址
     * @param {Object} request.manager - 负责人
     * @param {number} request.kdtId - 店铺kdtId
     * @param {number} request.hqKdtId - 总部店铺kdtId
     * @param {string} request.appName - 调shop-center应用名称(调用方在ops平台登记的应用名)
     * @param {number} request.businessId - 主营商品类目id
     * @param {string} request.ipAddress - 操作入口来源ip地址
     * @param {string} request.shopName - 店铺名称
     * @param {number} request.partnerKdtId - 父店铺kdtId
     * @param {Object} request.businessHoursSetting - 营业时间
     * @param {string} request.customerServicePhoneNumber - 客服电话
     * @param {string} request.customerServiceAreaCode - 客服电话区号
     * @param {string} request.entryAppName - 入口appName(调用方在ops平台登记的应用名)
     * @param {string} request.requestId - 请求id
     * @param {string} request.intro - 简介
     * @param {Object} request.funcConfigs - 功能配置
     * @param {string} request.logo - logo
     * @param {number} request.operatorType - 操作人帐号类型：1 卖家，2 内部员工cas id，3 未知，4 系统行为（如监听NSQ并主动修改数据）
     * @param {number} request.operatorId - 操作人帐号id
     * @return {Promise}
     */
  async updateSubShop(request) {
    return this.invoke('updateSubShop', [request]);
  }

  /**
     * 查询教育校区的店铺信息
     *
     * @see http://zanapi.qima-inc.com/site/service/view/983723
     * @param {number} hqKdtId -
     * @param {number} kdtId -
     * @return {Promise}
     */
  async querySubShop(hqKdtId, kdtId) {
    return this.invoke('querySubShop', [hqKdtId, kdtId]);
  }
}

module.exports = ChainShopConfigFacade;
