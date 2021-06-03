const BaseService = require('../../base/BaseService');

/* com.youzan.ump.details.api.FansBenfitService -  */
class FansBenfitService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.details.api.FansBenfitService';
  }

  /**
             *
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/719011
*
             *  @param {Object} qrCodeQueryParam -
             *  @param {number} qrCodeQueryParam.activityId - 活动id
             *  @param {string} qrCodeQueryParam.activityAlias - 活动alias
             *  @param {number} qrCodeQueryParam.preferentialType - 活动优惠类型
 1：粉丝专享价
 2：首次关注有礼
             *  @param {number} qrCodeQueryParam.clientType - 来源类型，1为小程序，2为h5
             *  @param {string} qrCodeQueryParam.goodsAlias - 商品alias
             *  @param {number} qrCodeQueryParam.kdtId - 店铺id
             *  @param {string} qrCodeQueryParam.shopName - 店铺名称
             *  @param {string} qrCodeQueryParam.goodsName - 商品名称
             *  @param {string} qrCodeQueryParam.activityDesc - 活动的优惠文案
             *  @return {Promise}
             */
  async getAutoReplyGoodsQrCode(qrCodeQueryParam) {
    return this.invoke('getAutoReplyGoodsQrCode', [qrCodeQueryParam]);
  }
}

module.exports = FansBenfitService;
