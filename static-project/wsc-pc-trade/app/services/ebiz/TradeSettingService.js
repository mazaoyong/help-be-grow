const BaseService = require('../base/BaseService');

/**
 * 获取交易设置
 */
class TradeSettingService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.setting.TradeSettingService';
  }

  /**
   *  交易设置-查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/141485
   *
   *  @param {Object} request -
   *  @param {number} request.kdtId -
   *  @param {string} request.source -
   *  @return {Promise}
   */
  async get(request) {
    return this.invoke('get', [request]);
  }

  /**
   *  交易设置-更新
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/141487
   *
   *  @param {Object} request -
   *  @param {string} request.invoiceContent - 开票内容
   *  @param {number} request.kdtId -
   *  @param {number} request.receiverNameCheck - 收货人地址姓名校验 0:关闭 1:开启
   *  @param {number} request.isRealNameAuthOpen - 是否实名认证开启
   *  @param {number} request.limitRealNameAuthMaxTimePerBuyerPerDay - 是否开启每天单个买家实名校验最大次数限制
   *  @param {number} request.autoConfirmReceiveTime - 自动确认收货时间
   *  @param {string} request.source - 请求来源，暂未定义，仅预留以后用作接口调用日志统计使用
   *  @param {number} request.supportOverseas - 支持海外地址配送 0:不支持 1:支持
   *  @param {number} request.orderExpireTime - 订单取消时间（分）
   *  @param {number} request.preMedia - 预订单提醒次数
   *  @param {number} request.expressAutoConfirm - 发货后确认收货时间 （天）
   *  @param {number} request.editPriceType - 订单改价类型。 0:整单改价。1:商品改价
   *  @param {number} request.confirmOrder - 待接单是否开启 0:不开启 1:开启
   *  @param {number} request.realNameAuthMaxTimePerBuyerPerDay - 每天单个买家实名认证最大次数
   *  @param {number} request.useInvoice - 是否开启发票组件
   *  @param {number} request.sendErrorMedia - 配送异常提醒次数
   *  @param {number} request.autoConfirm - 自动接单是否开启 0:不开启 1:开启
   *  @param {string} request.verifyCrossShop - 跨店核销开关
   *  @param {number} request.shopAutoShip - 是否开启自动收获 0:关闭 1:开启
   *  @param {number} request.confirmMedia - 待接单语音提醒次数， 0关闭
   *  @param {boolean} request.isOpenSignMore - 是否开启单品多运
   *  @return {Promise}
   */
  async update(request) {
    return this.invoke('update', [request]);
  }
}

module.exports = TradeSettingService;
