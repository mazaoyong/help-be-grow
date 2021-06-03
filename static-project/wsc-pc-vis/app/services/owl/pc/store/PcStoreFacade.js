const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.store.PcStoreFacade -  */
class PcStoreFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.store.PcStoreFacade';
  }

  /**
   *  B端查询上课地点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532032
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.latitude - 纬度，查距离需要传
   *  @param {string} query.keyword - 搜索关键词，搜网点名称或者详细地址，可以不传
   *  @param {Array.<Array>} query.storeIds[] - 网点id集合，查询对应网点的信息
   *  @param {Array} query.storeIds[] -
   *  @param {number} query.longitude - 经度，查距离需要传
   *  @return {Promise}
   */
  async findStore(kdtId, query) {
    return this.invoke('findStore', [kdtId, query]);
  }
}

module.exports = PcStoreFacade;
