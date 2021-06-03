const BaseService = require('../base/BaseService');
const retailSource = 'wsc-pc-ump';

/**
 * 商品分类
 */
class CategoryApi extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.retail.product.biz.api.service.CategoryApi';
  }

  /**
   *  获取分类信息,分页查询的数量是最顶级的数据。
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/10101
   *  @param {object} request -
   *  @param {Array<number>} request.categoryIds[] - 批量查询的类目id
   *  @param {Array} request.categoryIds[] -
   *  @param {boolean} request.sortedByScore -
   *  @param {string} request.retailSource - 请求来源,系统名称或前端终端(替代source)
   *  @param {number} request.level - 展示节点,0或空代表所有子分类，1表示不需求子分类，2表示获取单层子分类
   *  @param {number} request.kdtId -
   *  @param {number} request.adminId - 操作人id
   *  @param {string} request.source - 请求来源,系统名称或前端终端。
   *  @return {object}
   */
  async queryCategories(request) {
    request.retailSource = retailSource;
    return this.invoke('queryCategories', [request]);
  }
}

module.exports = CategoryApi;
