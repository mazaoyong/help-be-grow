const BaseService = require('../../base/BaseService');

/**
 * 店铺service
 * @class StoreService
 * @extends {BaseService}
 */
class StoreService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.StoreFacade';
  }

  /**
   *  根据条件查询网点信息，不分页
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/208462
   *
   *  @param {Object} req -
   *  @param {number} req.kdtId - 店铺id
   *  @param {number} req.latitude - 纬度，查距离需要传
   *  @param {string} req.keyword - 搜索关键词，搜网点名称或者详细地址，可以不传
   *  @param {string[]} req.storeIds[] - 网点id集合，查询对应网点的信息
   *  @param {Array} req.storeIds[] -
   *  @param {number} req.longitude - 经度，查距离需要传
   *  @return {Object}
   */
  async listStoreForB(req) {
    return this.invoke('listStoreForB', [req]);
  }
}

module.exports = StoreService;
