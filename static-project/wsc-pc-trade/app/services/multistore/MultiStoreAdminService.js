const BaseService = require('../base/BaseService');

/**
 * com.youzan.multistore.center.api.serivce.store.MultiStoreAdminService
 */
class MultiStoreAdminService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.multistore.center.api.serivce.store.MultiStoreAdminService';
  }

  /**
   *  根据kdtId和用户id查询该用户管理的网点的id
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/181583
   *  接口文档地址 ： https://doc.qima-inc.com/pages/viewpage.action?pageId=47053540
   *
   *  @param {Object} storeAdminQueryDTO -
   *  @param {number} storeAdminQueryDTO.kdtId - 口袋通id
   *  @param {number} storeAdminQueryDTO.adminId - 用户id
   *  @return {Promise<number>}
   */
  async getStoreIdByAdminIdAndKdtId(storeAdminQueryDTO) {
    return this.invoke('getStoreIdByAdminIdAndKdtId', [storeAdminQueryDTO]);
  }

  /**
   * 获取多网点管理员，网点信息
   * @link http://zanapi.qima-inc.com/site/service/view/222691
   * @param {*} kdtId
   * @param {*} adminId
   */
  async getStoreSimpleInfoByAdminIdAndKdtId(kdtId, adminId) {
    return this.invoke('getStoreSimpleInfoByAdminIdAndKdtId', [{ kdtId, adminId }]);
  }
}

module.exports = MultiStoreAdminService;
