const BaseService = require('../base/BaseService');

class WeappBusinessService extends BaseService {
  get WEAPP_BUSINESS_SERVICE() {
    return 'com.youzan.mall.shop.api.service.WeappBusinessService';
  }

  /**
   * 店铺服务电话
   * @param {*} kdtId
   */
  async getShopServicePhone(kdtId) {
    try {
      return await this.invoke(this.WEAPP_BUSINESS_SERVICE, 'getPhoneNo4WeappContact', [{ kdtId }]);
    } catch (error) {
      this.ctx.logger.warn(`获取店铺服务电话失败：${error.message}`, error);
      return {};
    }
  }
}

module.exports = WeappBusinessService;
