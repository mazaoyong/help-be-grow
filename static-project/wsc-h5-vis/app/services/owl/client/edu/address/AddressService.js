const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.client.edu.address.AddressFacade -  */
class AddressFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.address.AddressFacade';
  }

  /**
   *  C端查询网点信息列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/701617
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.kdtId - 店铺id
   *  @param {number} query.latitude - 纬度，查距离需要传
   *  @param {string} query.keyword - 搜索关键词，搜网点名称或者详细地址，可以不传
   *  @param {Array.<Array>} query.storeIds[] - 网点id集合，查询对应网点的信息
   *  @param {Array} query.storeIds[] -
   *  @param {number} query.longitude - 经度，查距离需要传
   *  @return {Promise}
   */
  async findAddressList(kdtId, query) {
    return this.invoke('findAddressList', [kdtId, query]);
  }
}

module.exports = AddressFacade;
