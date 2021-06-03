const BaseService = require('../base/BaseService');

/**
 * 物流多网点
 */
class StoreReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.multistore.center.api.service.StoreReadService';
  }

  /**
   *  根据条件查询网点名称
   *  接口文档地址 http://zanapi.qima-inc.com/site/service/view/470512
   *
   *  @param {Object} StoreQueryCondition -
   *  @param {number} StoreQueryCondition.kdtId - 店铺id
   *  @param {boolean} StoreQueryCondition.isStore - 是否为门店
   *  @param {boolean} StoreQueryCondition.isOnline - 是否是线上网点 0:不是，1:是
   *  @param {number} StoreQueryCondition.includeDel - 是否能查处被删除的 默认为false
   *  @param {number} StoreQueryCondition.includeStoreIds - 限定的网点id列表
   *  @param {number} StoreQueryCondition.sortBy - 排序字段（目前只支持created_time）
   *  @param {number} StoreQueryCondition.sortType - 1:升序，2:降序
   *  @return {Promise}
   */
  async listNameByCondition(StoreQueryCondition) {
    return this.invoke('listNameByCondition', [StoreQueryCondition]);
  }

  /**
   * 获取多网点列表，支持网点名称模糊查询
   * @link http://zanapi.qima-inc.com/site/service/view/222718
   * @param {*} params
   */
  async listStoreNamesPagedFromES(params) {
    return this.invoke('listStoreNamesPagedFromES', [params]);
  }
}

module.exports = StoreReadService;
