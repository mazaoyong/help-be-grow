const BaseService = require('../base/BaseService');

/**
 * com.youzan.trade.rpbatch.api.operate.BatchRefundOperateService -
 **/
class BatchRefundOperateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.rpbatch.api.operate.BatchRefundOperateService';
  }

  /**
   * 商家-批量拒绝退货
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/201068
   *
   * @param {Object} params
   * @param {Object} params.bizExtension - 业务扩展信息(有逻辑的扩展信息, 业务方写入前需跟我们登记)
   * @param {Array.<Object>} params.refundOrderInfoDTOList[] - 要处理的退款单列表
   * @param {Object} params.extension - 扩展信息
   * @param {number} params.kdtId - 店铺ID
   * @param {string} params.remark - 拒绝理由
   * @param {Object} params.source - 来源信息
   * @param {Object} params.operator - 操作者信息
   * @return {object}
   */
  async batchRefundGoodsRefuse(params) {
    return this.invoke('batchRefundGoodsRefuse', [params]);
  }

  /**
   * 商家-批量同意退货
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/201067
   *
   * @param {Object} params
   * @param {Array.<Object>} params.refundOrderInfoDTOList[] - 要处理的退款单列表
   * @param {Object} params.extension - 扩展信息
   * @param {string} params.address - 退货地址
   * @param {string} params.receiver - 收件人
   * @param {string} params.city - 城市
   * @param {number} params.kdtId - 店铺ID
   * @param {string} params.mobile - 收件人手机号
   * @param {number} params.postcode - 邮编
   * @param {string} params.telephone - 座机
   * @param {string} params.remark - 卖家退货留言
   * @param {Object} params.source - 来源信息
   * @param {Object} params.operator - 操作者信息
   * @param {Object} params.bizExtension - 业务扩展信息(有逻辑的扩展信息, 业务方写入前需跟我们登记)
   * @param {string} params.areaCode - 区号
   * @param {string} params.province - 省份
   * @param {string} params.extensionNumber - 分机号
   * @param {string} params.region - 地区
   * @return {object}
   */
  async batchRefundGoodsReturnAgree(params) {
    return this.invoke('batchRefundGoodsReturnAgree', [params]);
  }

  /**
   * 商家-批量拒绝退款
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/201066
   *
   * @param {Object} params
   * @param {Object} params.bizExtension - 业务扩展信息(有逻辑的扩展信息, 业务方写入前需跟我们登记)
   * @param {Array.<Object>} params.refundOrderInfoDTOList[] - 要处理的退款单列表
   * @param {Object} params.extension - 扩展信息
   * @param {number} params.kdtId - 店铺ID
   * @param {string} params.remark - 拒绝理由
   * @param {Object} params.source - 来源信息
   * @param {Object} params.operator - 操作者信息
   * @return {object}
   */
  async batchRefundRefuse(params) {
    return this.invoke('batchRefundRefuse', [params]);
  }

  /**
   * 卖家-批量同意退款
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/201065
   *
   * @param {Object} params
   * @param {Object} params.bizExtension - 业务扩展信息(有逻辑的扩展信息, 业务方写入前需跟我们登记)
   * @param {Array.<Object>} params.refundOrderInfoDTOList[] - 要处理的退款单列表
   * @param {Object} params.extension - 扩展信息
   * @param {number} params.kdtId - 店铺ID
   * @param {Object} params.source - 来源信息
   * @param {Object} params.operator - 操作者信息
   * @return {object}
   */
  async batchAgree(params) {
    return this.invoke('batchAgree', [params]);
  }
}

module.exports = BatchRefundOperateService;
