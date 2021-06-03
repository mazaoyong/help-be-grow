const BaseService = require('./IcBaseService');

/**
 * com.youzan.ic.service.ItemGroupService
 */
class ItemGroupService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ic.service.ItemGroupService';
  }

  /**
   * 获取商品分类根结点
   * zanapi地址: http://zanapi.qima-inc.com/site/service/view/139602
   * 迁移的时候 zanapi 就是空的
   *
   * @param {object} request
   * @param {number} request.kdtId
   * @return {Promise<any>}
   */
  async queryGroups(request) {
    return this.invoke('queryGroups', [request]);
  }
}

module.exports = ItemGroupService;
