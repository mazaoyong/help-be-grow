const BaseService = require('../../base/BaseService');

/* com.youzan.ump.asset.api.CouponGroupService -  */
class CouponGroupService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.asset.api.CouponGroupService';
  }

  /**
    * 根据ID查询优惠券（码）活动基本信息 支持连锁版
    * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/7645
    *
    * @param {number} kdtId - kdtID
    * @param {number} id - 活动ID
    * @return {Promise}
    */
  async getBase(kdtId, id) {
    return this.invoke('getBase', [kdtId, id]);
  }
}

module.exports = CouponGroupService;
