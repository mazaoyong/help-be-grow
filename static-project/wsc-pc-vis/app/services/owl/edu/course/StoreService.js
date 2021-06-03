const BaseService = require('../../../base/BaseService');

/**
 * 上课地点接口
 * @class
 */
class StoreService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.StoreFacade';
  }

  /**
   *  B端查询网点信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/234756
   *
   *  @param {Object} requestDTO -
   *  @param {number} requestDTO.kdtId - 店铺id
   *  @param {number} requestDTO.latitude - 纬度，查距离需要传
   *  @param {string} requestDTO.keyword - 搜索关键词，搜网点名称或者详细地址，可以不传
   *  @param {Array.<Array>} requestDTO.storeIds[] - 网点id集合，查询对应网点的信息
   *  @param {Array} requestDTO.storeIds[] -
   *  @param {number} requestDTO.longitude - 经度，查距离需要传
   *  @return {Object}
   */
  async getStoreList(requestDTO) {
    const result = await this.invoke('listStoreForB', [requestDTO]);
    return result;
  }
}

module.exports = StoreService;
