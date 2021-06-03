const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.pc.api.courseitem.product.PcProductLockFacade -  */
class PcProductLockFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.courseitem.product.PcProductLockFacade';
  }

  /**
   *  查询商品锁类型
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532027
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async findLockTypes(kdtId, alias) {
    return this.invoke('findLockTypes', [kdtId, alias]);
  }

  /**
   *  批量查询商品锁类型
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/578966
   *
   *  @param {number} kdtId -
   *  @param {Array} aliases -
   *  @return {Promise}
   */
  async findLockTypeListByAliases(kdtId, aliases) {
    return this.invoke('findLockTypeListByAliases', [kdtId, aliases]);
  }
}

module.exports = PcProductLockFacade;
