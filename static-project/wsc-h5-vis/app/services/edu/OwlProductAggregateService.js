const EduBaseService = require('./EduBaseService');

/* com.youzan.owl.api.facade.product.OwlProductAggregateFacade -  */
class OwlProductAggregateService extends EduBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.facade.product.OwlProductAggregateFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/398184
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.types - 类型
   *  @param {Array.<Array>} query.productIds[] - 需要包含的id
   *  @param {Array.<Array>} query.excludeProductIds[] - 需要排除的id
   *  @return {Promise}
   */
  async findPage(kdtId, pageRequest, query) {
    return this.invoke('findPage', [kdtId, pageRequest, query]);
  }
}

module.exports = OwlProductAggregateService;
