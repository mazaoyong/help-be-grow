const BaseService = require('../../base/BaseService');

/**
 * com.youzan.ump.asset.trade.service.CouponVerifyService -
 */
class CouponVerifyService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.asset.trade.service.CouponVerifyService';
  }

  /**
   *  核销卡券
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/55400
   *
   *  @param {Object} couponVerifyParamDTO - 核销卡券参数对象
   *  @param {string} couponVerifyParamDTO.verifyCode - 核销码或一卡一码code
   *  @param {number} couponVerifyParamDTO.kdtId - kdt id
   *  @param {string} couponVerifyParamDTO.remark - 备注
   *  @param {number} couponVerifyParamDTO.buyerId - 店铺管理员id
   *  @param {number} couponVerifyParamDTO.verifyType - 验证方式: 1.扫码 2.输入code
   *  @return {Promise}
   */
  async verify(couponVerifyParamDTO) {
    return this.invoke('verify', [couponVerifyParamDTO]);
  }
}

module.exports = CouponVerifyService;
