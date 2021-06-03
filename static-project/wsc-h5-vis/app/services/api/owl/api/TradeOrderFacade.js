const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.trade.TradeOrderFacade -  */
class TradeOrderFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.trade.TradeOrderFacade';
  }

  /**
   *  预下单确认
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/709041
   *
   *  @param {Object} command -
   *  @param {Object} command.umpInfo - 购买营销活动优惠信息
   *  @param {Object} command.userInfo - 用户信息
   *  @param {boolean} command.fromThirdApp - 是否来自第三方app
   *  @param {number} command.kdtId - 店铺id
   *  @param {Object} command.studentInfo - 学员信息（只要包含线下课的订单就有该项）
   *  @param {string} command.orderAlias - 订单别名（该字段前端无需传递，目前仅用于后端生成送礼订单回调地址入参）
   *  @param {number} command.channelType - 渠道类型 2 邀请卡 3 送礼
   *  @param {string} command.source - userAgent
   *  @param {string} command.bookKey - bookKey入参
   *  @param {Array.<Object>} command.productInfoList[] - 购买商品信息
   *  @param {Object} command.payAsset - 店铺维度支付资产
   *  @param {Object} command.infoCollect - 买家信息采集（只有知识付费商品的订单有该项）
   *  @param {Object} command.lessonAppointmentDTO - 课程预约信息
   *  @param {string} command.bizTracePoint - 来源监控信息
   *  @param {string} command.callbackUrl - 回调地址
   *  @param {string} command.orderMark - 订单备注
   *  @return {Promise}
   */
  async confirm(command) {
    return this.invoke('confirm', [command]);
  }

  /**
   *  创建下单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/717247
   *
   *  @param {Object} command -
   *  @param {Object} command.umpInfo - 购买营销活动优惠信息
   *  @param {Object} command.userInfo - 用户信息
   *  @param {boolean} command.fromThirdApp - 是否来自第三方app
   *  @param {number} command.kdtId - 店铺id
   *  @param {Object} command.studentInfo - 学员信息（只要包含线下课的订单就有该项）
   *  @param {number} command.channelType - 渠道类型 2 邀请卡 3 送礼
   *  @param {string} command.source - userAgent
   *  @param {Array.<Object>} command.productInfoList[] - 购买商品信息
   *  @param {Object} command.payAsset - 店铺维度支付资产
   *  @param {Object} command.infoCollect - 买家信息采集（只有知识付费商品的订单有该项）
   *  @param {string} command.bizTracePoint - 来源监控信息
   *  @param {string} command.callbackUrl - 回调地址
   *  @param {string} command.orderMark - 订单备注
   *  @return {Promise}
   */
  async create(command) {
    return this.invoke('create', [command]);
  }

  /**
   *  新的预下单确认
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1005921
   *
   *  @param {Object} command -
   *  @param {Object=} command.umpInfo - 购买营销活动优惠信息
   *  @param {Object} command.userInfo - 用户信息
   *  @param {boolean=} command.fromThirdApp - 是否来自第三方app
   *  @param {number} command.kdtId - 店铺id
   *  @param {Object=} command.studentInfo - 学员信息（只要包含线下课的订单就有该项）
   *  @param {string=} command.orderAlias - 订单别名（该字段前端无需传递，目前仅用于后端生成送礼订单回调地址入参）
   *  @param {number=} command.channelType - 渠道类型 2 邀请卡 3 送礼
   *  @param {string} command.source - userAgent
   *  @param {string} command.bookKey - bookKey入参
   *  @param {Array.<Object>=} command.productInfoList[] - 购买商品信息
   *  @param {Object=} command.payAsset - 店铺维度支付资产
   *  @param {Object=} command.infoCollect - 买家信息采集（只有知识付费商品的订单有该项）
   *  @param {Object=} command.lessonAppointmentDTO - 课程预约信息
   *  @param {string=} command.bizTracePoint - 来源监控信息
   *  @param {string=} command.callbackUrl - 回调地址
   *  @param {string=} command.orderMark - 订单备注
   *  @return {Promise}
   */
  async prepare(command) {
    return this.invoke('prepare', [command]);
  }

  /**
   *  下单前获取book key
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/711631
   *
   *  @param {Object} command -
   *  @param {Object} command.umpInfo - 购买营销活动优惠信息
   *  @param {Object} command.userInfo - 用户信息
   *  @param {number} command.kdtId - 店铺id
   *  @param {number} command.channelType - 渠道类型 2 邀请卡 3 送礼
   *  @param {string} command.bizTracePoint - 来源监控信息
   *  @param {Array.<Object>} command.productInfoList[] - 购买商品信息
   *  @param {string} command.orderMark - 订单备注
   *  @return {Promise}
   */
  async cache(command) {
    return this.invoke('cache', [command]);
  }
}

module.exports = TradeOrderFacade;
