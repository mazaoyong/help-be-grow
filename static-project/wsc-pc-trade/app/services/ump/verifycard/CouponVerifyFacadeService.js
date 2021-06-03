const BaseService = require('../../base/BaseService');

/**
 * com.youzan.ump.asset.facade.CouponVerifyFacadeService -
 */
class CouponVerifyFacadeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.asset.facade.CouponVerifyFacadeService';
  }

  /**
   *  卡券有效期延长列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/432388
   *
   *  @param {*} kdtId 店铺id
   *  @param {Number} verifyCode 优惠券核销码
   *  @return {Promise}
   */
  async getCouponByVerifyCode(kdtId, verifyCode) {
    return this.invoke('getCouponByVerifyCode', [kdtId, verifyCode]);
  }

  /**
   *  根据条件 搜索核销记录列表(分店只能查询本店铺核销的记录，总店可查询全部店铺核销的记录)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/432389
   *
   *  @param {Object} paramDTO - 查询请求参数
   *  @param {string} paramDTO.beginAt - 开始时间
   *  @param {number} paramDTO.kdtId - 总店KdtId
   *  @param {string} paramDTO.couponType - 活动类型 card code
   *  @param {number} paramDTO.pageNo - 起始页码：1
   *  @param {number} paramDTO.couponGroupId - 活动ID
   *  @param {number} paramDTO.pageSize - 每页数量 最大值：200
   *  @param {string} paramDTO.keyword - 关键字
   *  @param {string} paramDTO.endAt - 结束时间
   *  @param {number} paramDTO.subKdtId - 分店KdtId
   *  @return {Promise}
   */
  async searchVerifyLogList(paramDTO) {
    return this.invoke('searchVerifyLogList', [paramDTO]);
  }
}

module.exports = CouponVerifyFacadeService;
