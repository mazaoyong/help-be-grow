const BaseService = require('../base/BaseService');

/**
 * 售后换货相关
 */
class SellerExchangeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.exchangeGoods.SellerExchangeService';
  }

  /**
   *  同意换货
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/756993
   *
   *  @param {Object} sellerExchangeAgreeReqDTO -
   *  @param {string} sellerExchangeAgreeReqDTO.areaCode - 区号
   *  @param {string} sellerExchangeAgreeReqDTO.address - 退货地址
   *  @param {string} sellerExchangeAgreeReqDTO.receiver - 收件人
   *  @param {string} sellerExchangeAgreeReqDTO.province - 省份
   *  @param {string} sellerExchangeAgreeReqDTO.city - 城市
   *  @param {string} sellerExchangeAgreeReqDTO.extensionNumber - 分机号
   *  @param {string} sellerExchangeAgreeReqDTO.mobile - 收件人手机号
   *  @param {number} sellerExchangeAgreeReqDTO.postcode - 邮编
   *  @param {string} sellerExchangeAgreeReqDTO.telephone - 座机
   *  @param {string} sellerExchangeAgreeReqDTO.remark - 卖家退货留言
   *  @param {string} sellerExchangeAgreeReqDTO.region - 地区
   *  @return {Promise}
   */
  async exchangeAgree(sellerExchangeAgreeReqDTO) {
    return this.invoke('exchangeAgree', [sellerExchangeAgreeReqDTO]);
  }

  /**
   *  同意换货并发送换货商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/756995
   *
   *  @param {Object} sellerExchangeGoodsReturnReqDTO -
   *  @param {string} sellerExchangeGoodsReturnReqDTO.companyCode - 物流公司编号
   *  @param {Array.<Array>} sellerExchangeGoodsReturnReqDTO.attachment[] - 信息附件
   *  @param {Array} sellerExchangeGoodsReturnReqDTO.attachment[] -
   *  @param {string} sellerExchangeGoodsReturnReqDTO.phone - 手机号码
   *  @param {string} sellerExchangeGoodsReturnReqDTO.logisticsNo - 物流公司运单号
   *  @param {string} sellerExchangeGoodsReturnReqDTO.remark - 原因描述
   *  @return {Promise}
   */
  async exchangeGoodsReturnAgree(sellerExchangeGoodsReturnReqDTO) {
    return this.invoke('exchangeGoodsReturnAgree', [sellerExchangeGoodsReturnReqDTO]);
  }

  /**
   *  拒绝换货
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/756994
   *
   *  @param {Object} sellerExchangeRejectReqDTO -
   *  @param {string} sellerExchangeRejectReqDTO.remark - 拒绝理由
   *  @return {Promise}
   */
  async exchangeReject(sellerExchangeRejectReqDTO) {
    return this.invoke('exchangeReject', [sellerExchangeRejectReqDTO]);
  }

  /**
   *  拒绝收货
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/756996
   *
   *  @param {Object} sellerExchangeRejectRecieveReqDTO -
   *  @param {string} sellerExchangeRejectRecieveReqDTO.remark - 拒绝理由
   *  @return {Promise}
   */
  async exchangeGoodsReturnReject(sellerExchangeRejectRecieveReqDTO) {
    return this.invoke('exchangeGoodsReturnReject', [sellerExchangeRejectRecieveReqDTO]);
  }
}

module.exports = SellerExchangeService;
