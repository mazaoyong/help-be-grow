const DeliveryBaseService = require('./DeliveryBaseService');

/**
 * 发货相关
 */
class OrderDeliveryService extends DeliveryBaseService {
  /**
   * OrderDeliveryService
   */
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.delivery.OrderDeliveryService';
  }

  /**
   * 计算运费
   *
   * @param {object} data
   * @param {number} data.kdtId            店铺ID
   * @param {string} data.orderNo          订单号
   * @param {string=} data.auditNo         审核单编号 电子面单和上门取件计算运费必传
   * @param {number=} data.deliveryType    发货方式
   * @param {number=} data.deliveryPointId 出货点
   * @param {number=} data.distChannel     配送渠道
   * @param {number=} data.distWeight      配送重量
   * @param {number=} data.expressId       快递公司id 电子面单和上门取件计算运费必传
   * @param {number=} data.storeId         多网点门店
   *
   * @return {Promise.<object>}
   * @memberof OrderDeliveryService
   *
   * doc: http://zanapi.qima-inc.com/site/service/view/104354
   */
  async deliveryCalculateFee(data) {
    return this.invoke('deliveryCaculateFee', [data]);
  }

  /**
   * 查询快递列表，修改物流使用
   * api: http://zanapi.qima-inc.com/site/service/view/179097
   * @param {number} kdtId
   * @param {string} orderNo
   */
  async expressList(kdtId, orderNo) {
    return this.invoke('expressList', [
      {
        orderNo,
        kdtId,
      },
    ]);
  }

  /**
   *  物流信息查询接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104359
   *
   *  @param {Object} logisticsQueryRequestDTO -
   *  @param {string} logisticsQueryRequestDTO.orderNo - 订单号
   *  @param {number} logisticsQueryRequestDTO.kdtId - 商店id
   *  @return {Promise}
   */
  async logisticsQueryByOrderNo(logisticsQueryRequestDTO) {
    return this.invoke('logisticsQueryByOrderNo', [logisticsQueryRequestDTO]);
  }

  /**
   * 修改物流
   * api: http://zanapi.qima-inc.com/site/service/view/179098
   * @param {object} params
   */
  async modifyExpress(params) {
    return this.invoke('modifyExpress', [params]);
  }

  /**
   * 订单发货
   * api: http://zanapi.qima-inc.com/site/service/view/104347
   * @param {object} params
   */
  async delivery(params = {}) {
    return this.invoke('delivery', [params]);
  }

  /**
   * 取消呼叫
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104352
   *
   * @param {object} request
   * @param {string} request.packId - kdt_id+原packId
   * @param {string} request.orderNo - 订单Id
   * @param {number} request.cancelReasonId - 取消原因id
   * @param {number} request.kdtId - 口袋通id，有赞内部必填，必须唯一
   * @param {number} request.currentStatus - 页面当前状态
   * @param {Object} request.source - 来源信息
   * @param {string} request.cancelReason - 取消原因
   * @param {Object} request.operator - 操作者信息
   * @return {object}
   */
  async cancelCall(request) {
    return this.invoke('deliveryCancelCall', [request]);
  }

  /**
   * 根据配送单号查询包裹信息
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225272
   *
   * @param {object} request
   * @param {string} request.packId - 包裹号
   * @param {boolean} request.includeICDetail - 是否包含包裹详情
   *
   * @return {object}
   */
  async queryDistOrderByDistId(request) {
    return this.invoke('queryDistOrderByDistId', [request]);
  }

  /**
   *  编辑自动发货配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225271
   *
   *  @param {Object} request -
   *  @param {number} request.preferredDistChannel - 优先会叫渠道  1：达达  2：蜂鸟
   *  @param {number} request.secondDistChannel - 备选呼叫渠道  1：达达  2：蜂鸟
   *  @param {number} request.kdtId -
   *  @param {boolean} request.enable - 是否开启自动发货
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Object} request.alphaExpressConfigDTO - 智能发货配置
   *  @param {number} request.delayTime - 自动发货延时时间(毫秒)
   *  @param {Object} request.source - 来源信息
   *  @param {number} request.storeId -
   *  @param {number} request.timeout - 自动发货超时时间(毫秒)
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async editAutoCallConfig(request) {
    return this.invoke('editAutoCallConfig', [request]);
  }

  /**
   *  查询自动发货配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225270
   *
   *  @param {Object} request -
   *  @param {number} request.preferredDistChannel - 优先会叫渠道  1：达达  2：蜂鸟
   *  @param {number} request.secondDistChannel - 备选呼叫渠道  1：达达  2：蜂鸟
   *  @param {number} request.kdtId -
   *  @param {boolean} request.enable - 是否开启自动发货
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Object} request.alphaExpressConfigDTO - 智能发货配置
   *  @param {number} request.delayTime - 自动发货延时时间(毫秒)
   *  @param {Object} request.source - 来源信息
   *  @param {number} request.storeId -
   *  @param {number} request.timeout - 自动发货超时时间(毫秒)
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async getAutoCallConfig(request) {
    return this.invoke('getAutoCallConfig', [request]);
  }

  /**
   *  收货地址修改接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104358
   *
   *  @param {Object} logisticsUpdateRequestDTO -
   *  @param {string} logisticsUpdateRequestDTO.receiverTel - 收货人电话
   *  @param {string} logisticsUpdateRequestDTO.deliveryCity - 交货地址——市
   *  @param {string} logisticsUpdateRequestDTO.orderNo - 订单号
   *  @param {number} logisticsUpdateRequestDTO.kdtId - 商店id
   *  @param {string} logisticsUpdateRequestDTO.receiverName - 收货人姓名
   *  @param {string} logisticsUpdateRequestDTO.deliveryProvince - 交货地址——省
   *  @param {string} logisticsUpdateRequestDTO.deliveryStreet - 交货地址——街道
   *  @param {Object} logisticsUpdateRequestDTO.source - 来源信息
   *  @param {Object} logisticsUpdateRequestDTO.operator - 操作者信息
   *  @param {string} logisticsUpdateRequestDTO.deliveryDistrict - 交货地址——区
   *  @param {string} logisticsUpdateRequestDTO.requestId - 请求标识(长度为24位)
   *  @param {string} logisticsUpdateRequestDTO.deliveryCountry - 交货地址——国家
   *  @param {string} logisticsUpdateRequestDTO.deliveryPostalCode - 交货地址——邮编
   *  @return {Promise}
   */
  async updateLogistics(logisticsUpdateRequestDTO) {
    return this.invoke('updateLogistics', [logisticsUpdateRequestDTO]);
  }

  /**
   *  根据订单号查询包裹信息列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/452677
   *
   *  @param {Object} request -
   *  @param {string} request.packId - kdt_id+原packId
   *  @param {string} request.orderNo - 订单Id
   *  @param {number} request.kdtId - 口袋通id，有赞内部必填，必须唯一
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async listDistOrderByOrderNo(request) {
    return this.invoke('listDistOrderByOrderNo', [request]);
  }

  /**
   *  发货弹框
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/179083
   *
   *  @param {Object} request -
   *  @param {number} request.itemId - 商品ID-选传
   *  @param {string} request.orderNo - 订单号-必传
   *  @param {number} request.callSource - 调用来源
   *  @param {number} request.kdtId - 门店号-必传
   *  @param {number} request.storeId - 多店铺的门店编号
   *  @return {Promise}
   */
  async deliveryWindow(request) {
    return this.invoke('deliveryWindow', [request]);
  }

  /**
   *  同城配送详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104356
   *
   *  @param {Object} request -
   *  @param {string} request.packId - kdt_id+原packId
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 口袋通id，有赞内部必填，必须唯一
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {boolean} request.location -
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async cityDetail(request) {
    return this.invoke('cityDetail', [request]);
  }

  /**
   *  取消呼叫
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104352
   *
   *  @param {Object} request -
   *  @param {string} request.packId - kdt_id+原packId
   *  @param {string} request.orderNo - 订单Id
   *  @param {number} request.cancelReasonId - 取消原因id
   *  @param {number} request.kdtId - 口袋通id，有赞内部必填，必须唯一
   *  @param {number} request.currentStatus - 页面当前状态
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.cancelReason - 取消原因
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async deliveryCancelCall(request) {
    return this.invoke('deliveryCancelCall', [request]);
  }

  /**
   *  重新呼叫配送员
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104351
   *
   *  @param {Object} request -
   *  @param {string} request.packId - kdt_id+原packId
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 口袋通id，有赞内部必填，必须唯一
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async deliveryReCall(request) {
    return this.invoke('deliveryReCall', [request]);
  }

  /**
   *  加小费
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104353
   *
   *  @param {Object} request -
   *  @param {string} request.packId - 包裹Id
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺Id
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {string} request.remark - 备注(字段最大长度：512)
   *  @param {Object} request.source - 来源信息
   *  @param {number} request.tips - 小费金额(单位：分)
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async deliveryAddTip(request) {
    return this.invoke('deliveryAddTip', [request]);
  }

  /**
   *  取消自动呼叫
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225268
   *
   *  @param {Object} request -
   *  @param {string} request.packId - kdt_id+原packId
   *  @param {string} request.orderNo - 订单Id
   *  @param {number} request.cancelReasonId - 取消原因id
   *  @param {number} request.kdtId - 口袋通id，有赞内部必填，必须唯一
   *  @param {number} request.currentStatus - 页面当前状态
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.cancelReason - 取消原因
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async cancelAutoCall(request) {
    return this.invoke('cancelAutoCall', [request]);
  }

  /**
    *  确认收货
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/772153 
    *
    *  @param {Object} request - 
    *  @param {string} request.orderNo - 订单号
    *  @param {number} request.kdtId - 店铺id
    *  @param {Object} request.operator - 操作人
    *  @param {string} request.operator.role - 操作人角色
system|buyer|seller|insider
    *  @param {string} request.operator.operatorPhone - 操作人手机号
    *  @param {integer} request.operator.operatorId - 操作人ID
    *  @param {string} request.operator.operatorName - 操作人姓名
    *  @return {Promise}
    */
  async confirmReceiveOrder(request) {
    return this.invoke('confirmReceiveOrder', [request]);
  }
}

module.exports = OrderDeliveryService;
