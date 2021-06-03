const BaseService = require('../../../base/BaseService');

/**
 * ItemGroupManageService
 */
class ItemGroupManageService extends BaseService {
  /**
   * SERVICE_NAME
   *
   * @return {string}
   * @class
   */
  get SERVICE_NAME() {
    return 'com.youzan.ic.service.ItemGroupManageService';
  }

  /**
   * 获取门店网店商品分组信息
   * 文档：http://zanapi.qima-inc.com/site/service/view/277618
   *
   * @param {Object} data
   * @return {Promise}
   */
  async queryUpperGroup(data = {}) {
    const result = await this.invoke('queryUpperGroupPageListByParam', [data]);
    return result;
  }
}

module.exports = ItemGroupManageService;
