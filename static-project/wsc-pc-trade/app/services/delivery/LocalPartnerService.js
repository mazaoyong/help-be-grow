const BaseService = require('../base/BaseService');
const { appName } = require('../../constants');

/**
 *
 *
 * @class LocalPartnerService
 * @extends {BaseService}
 */
class LocalPartnerService extends BaseService {
  /**
   * 服务名称
   *
   * @readonly
   * @memberof LocalPartnerService
   */
  get SERVICE_NAME() {
    return 'com.youzan.delivery.service.LocalPartnerService';
  }

  /**
   * 查询对应的第三方渠道是否支持小费以及对应小费规格
   *
   * @param {object} takeoutTipInfoParam
   * @param {number} takeoutTipInfoParam.deliveryChannel - 接入的物流渠道方：1.达达，2.蜂鸟，3.点我达
   * @return {Promise<object>}
   * doc http://zanapi.qima-inc.com/site/service/view/150766
   */
  async getTipInfo(takeoutTipInfoParam) {
    return this.invoke('getTipInfo', [
      {
        ...takeoutTipInfoParam,
        fromApp: appName,
      },
    ]);
  }

  /**
   * 根据渠道获取渠道配置
   *
   * @param {number} channel
   * @return {Promise<Object>}
   * @memberof LocalPartnerService
   */
  async getChannelConfig(channel) {
    return this.invoke('getChannelConfig', [
      {
        deliveryChannel: channel,
        fromApp: appName,
      },
    ]);
  }

  /**
   * 查询所有的第三方渠道的重量分段数据
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/232719
   *
   * @return {Promise<Object>}
   */
  async listAllWeightInfo() {
    return this.invoke('listAllWeightInfo', []);
  }

  /**
   *  查询所有的第三方渠道的重量分段数据、包括kdtid购买的云app应用
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505578
   *
   *  @param {Object} localPartnerWeightInfoParam -
   *  @param {number} localPartnerWeightInfoParam.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId,有赞外卖1001，有赞商城1002
   *  @param {number} localPartnerWeightInfoParam.kdtId - 口袋通id，有赞内部必填，必须唯一，用于结算运费
   *  @param {string} localPartnerWeightInfoParam.fromApp - 请求来源app
   *  @param {string} localPartnerWeightInfoParam.requestId - UUID
   *  @param {number} localPartnerWeightInfoParam.storeId - 门店编码，每个接入方保证唯一, 0 或 null 代表单店
   *  @param {number} localPartnerWeightInfoParam.headId - 总店id
   *  @return {Promise}
   */
  async listAllWeightInfoWithYunApps(localPartnerWeightInfoParam) {
    return this.invoke('listAllWeightInfoWithYunApps', [localPartnerWeightInfoParam]);
  }

  /**
   *  查询所有第三方服务商列表。列出所有服务商，同时带上服务商的是否开通、是否启用、城市是否支持、审核周期等信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/204173
   *
   *  @param {Object} param - 物流店铺信息
   *  @param {number} param.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId,有赞外卖1001，有赞商城1002
   *  @param {string} param.cityName - 市
   *  @param {number} param.kdtId - 口袋通id，有赞内部必填，必须唯一，用于结算运费
   *  @param {string} param.fromApp - 请求来源app
   *  @param {string} param.requestId - UUID
   *  @param {string} param.provinceName - 省
   *  @param {number} param.storeId - 门店编码，每个接入方保证唯一, 0 或 null 代表单店
   *  @param {string} param.countyName - 区
   *  @return {Promise}
   */
  async listAllLocalPartners(param) {
    return this.invoke('listAllLocalPartners', [param]);
  }

  /**
   *  启用第三方服务商, 同步到第三方, 返回第三方审核结果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/121902
   *
   *  @param {Object} param - 服务商启用参数
   *  @param {number} param.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId,有赞外卖1001，有赞商城1002 必须用常量
   *  @param {number} param.business - 业务类型
   *  @param {string} param.lng - 门店经度
   *  @param {number} param.kdtId - 口袋通id，有赞内部必填，必须唯一，用于结算运费
   *  @param {string} param.fromApp - 请求来源app
   *  @param {number} param.deliveryChannel - 接入的物流渠道方：1.达达，2.蜂鸟，3.点我达 不允许为null
   *  @param {string} param.contactName - 联系人姓名
   *  @param {string} param.idCard - 联系人身份证/
   *  @param {number} param.storeId - 门店编码，每个接入方保证唯一, 0 或 null 代表单店
   *  @param {string} param.stationAddress - 门店地址
   *  @param {string} param.cityName - 城市名称(如,杭州市)
   *  @param {number} param.positionSource - 经纬度来源, 1:腾讯地图, 2:百度地图, 3: 高德系
   *  @param {string} param.phone - 联系人电话
   *  @param {string} param.requestId - UUID
   *  @param {Object} param.buyerGpsInfoParam - 买家经纬度来源
   *  @param {string} param.stationName - 门店名称
   *  @param {string} param.provinceName - 省份名称(如,浙江省)
   *  @param {string} param.lat - 门店纬度
   *  @param {string} param.countyName - 区域名称(如,西湖区)
   *  @return {Promise}
   */
  async enablePartner(param) {
    return this.invoke('enablePartner', [param]);
  }

  /**
   *  打开或者关闭服务商开关
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/155753
   *
   *  @param {Object} param - 请求参数
   *  @param {number} param.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId,有赞外卖1001，有赞商城1002
   *  @param {number} param.kdtId - 口袋通id，有赞内部必填，必须唯一，用于结算运费
   *  @param {string} param.fromApp - 请求来源app
   *  @param {number} param.enable - 启用状态， 0 未启用， 1 启用
   *  @param {string} param.requestId - UUID
   *  @param {number} param.channel - 接入的物流渠道方：1.达达，2.蜂鸟，3.点我达 不允许为null
   *  @param {Object} param.buyerGpsInfoParam - 买家经纬度来源
   *  @param {number} param.storeId - 门店编码，每个接入方保证唯一, 0 或 null 代表单店
   *  @return {Promise}
   */
  async togglePartners(param) {
    return this.invoke('togglePartners', [param]);
  }

  /**
   *  不同配送公司的配送费展示
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/168849
   *
   *  @param {Object} localPartnerFeeInfoParam -
   *  @param {number} localPartnerFeeInfoParam.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId,有赞外卖1001，有赞商城1002
   *  @param {number} localPartnerFeeInfoParam.kdtId - 口袋通id，有赞内部必填，必须唯一，用于结算运费
   *  @param {string} localPartnerFeeInfoParam.fromApp - 请求来源app
   *  @param {number} localPartnerFeeInfoParam.deliveryChannel - 接入的物流渠道方：1.达达，2.蜂鸟，3.点我达 不允许为null
   *  @param {string} localPartnerFeeInfoParam.requestId - UUID
   *  @param {number} localPartnerFeeInfoParam.storeId - 门店编码，每个接入方保证唯一, 0 或 null 代表单店
   *  @return {Promise}
   */
  async getLocalPartnerFeeInfo(localPartnerFeeInfoParam) {
    return this.invoke('getLocalPartnerFeeInfo', [localPartnerFeeInfoParam]);
  }

  /**
   *  获取订单取消原因列表, 参数信息保存在apollo
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/121904
   *  @param {Object} param - 同城配送渠道信息
   *  @param {string} param.fromApp - 请求来源app
   *  @param {number} param.deliveryChannel - 接入的物流渠道方：1.达达，2.蜂鸟，3.点我达 不允许为null
   *  @param {string} param.requestId - UUID
   *  @param {string} param.appId - appid
   *  @param {boolean} param.isCloudTag - 云标
   *  @return {Promise}
   */
  async getOrderCancelReasons(param) {
    return this.invoke('getOrderCancelReasons', [param]);
  }

  /**
   *  获取取消订单违约金
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/121905
   *  @param {Object} param - 取消订单参数, 仅需要sourceId + orderId
   *  @param {number} param.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId,有赞外卖1001，有赞商城1002
   *  @param {string} param.orderId - 第三方订单编号
   *  @param {string} param.fromApp - 请求来源app
   *  @param {string} param.requestId - UUID
   *  @return {Promise}
   */
  async getCancelDeductFee(param) {
    return this.invoke('getCancelDeductFee', [param]);
  }
}

module.exports = LocalPartnerService;
