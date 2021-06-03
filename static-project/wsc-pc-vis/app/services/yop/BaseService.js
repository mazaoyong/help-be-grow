const PCBaseService = require('@youzan/wsc-pc-base/app/services/base/PCBaseService');

/**
 * Market相关的http接口
 */
class BaseService extends PCBaseService {
  /**
   * SERVICE_NAME
   *
   * @return {string}
   * @constructor
   */
  get DOMAIN_NAME() {
    return 'YOP_MARKET_URL';
  }

  /**
   * 获取营销dashboard顶部配置-插件推荐
   * 文档：https://doc.qima-inc.com/pages/viewpage.action?pageId=11858835
   *
   * @param {number} kdtId
   * @return {Promise<Object>}
   */
  async getAppRecommend(kdtId) {
    return this.ajax({
      url: '/app_recommend/kdt_special',
      method: 'GET',
      data: {
        kdt_id: kdtId,
      },
    });
  }
}

module.exports = BaseService;
