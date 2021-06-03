const BaseService = require('../../base/BaseService');

/**
 * Iron Api Service 存放未服务化的iron老接口
 * @class IronApiService
 * @extends {BaseService}
 */
class IronApiService extends BaseService {
  /**
   * 设置店铺关联微页面模板
   *
   * @param {number} kdtId kdtid
   * @param {Object} config 初始化配置
   * @return {Object}
   * @memberof IronApiService
   */
  async chooseSolutionByCategoryId(kdtId, { categoryId, isCreateGoods = 'true' }) {
    const result = await this.apiCall({
      url: `/account/team/chooseSolutionByCategoryId`,
      method: 'POST',
      data: {
        kdt_id: kdtId,
        category_id: categoryId,
        is_create_goods: isCreateGoods,
      },
      contentType: 'application/json',
    });
    return result;
  }
}

module.exports = IronApiService;
