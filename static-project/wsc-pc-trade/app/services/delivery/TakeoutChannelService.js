const BaseService = require('../base/BaseService');

/**
 * com.youzan.delivery.service.TakeoutChannelService
 */
class TakeoutChannelService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.delivery.service.TakeoutChannelService';
  }

  /**
   *  获取授权参数，前端通过该参数get请求，跳转到达达授权界面
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1003304
   *
   *  @param {Object} param -
   *  @param {number} param.role - 操作人角色 system|buyer|seller|insider
   *  @param {string} param.fromApp - 请求来源app
   *  @param {number} param.deliveryChannel - 自结算授权的渠道id
   *  @param {string} param.requestId - UUID
   *  @param {number} param.loginKdtId - 授权店铺，前端传当前登陆店铺kdtId（只有单店或连锁总部才具有授权能力）
   *  @param {string} param.operatorPhone - 操作人手机号
   *  @param {number} param.operatorId - 操作人ID
   *  @param {string} param.operatorName - 操作人姓名
   *  @return {Promise}
   */
  async getAuthorizeParams(param) {
    return this.invoke('getAuthorizeParams', [param]);
  }

  /**
   *  刷新授权结果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1003305
   *
   *  @param {Object} param -
   *  @param {number} param.role - 操作人角色 system|buyer|seller|insider
   *  @param {string} param.fromApp - 请求来源app
   *  @param {number} param.deliveryChannel - 自结算授权的渠道id
   *  @param {string} param.requestId - UUID
   *  @param {number} param.loginKdtId - 授权店铺，前端传当前登陆店铺kdtId（只有单店或连锁总部才具有授权能力）
   *  @param {string} param.operatorPhone - 操作人手机号
   *  @param {number} param.operatorId - 操作人ID
   *  @param {string} param.operatorName - 操作人姓名
   *  @return {Promise}
   */
  async refreshAuthorizeResult(param) {
    return this.invoke('refreshAuthorizeResult', [param]);
  }

  /**
   *  解除授权
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1003306
   *
   *  @param {Object} param -
   *  @param {number} param.role - 操作人角色 system|buyer|seller|insider
   *  @param {string} param.fromApp - 请求来源app
   *  @param {number} param.deliveryChannel - 自结算授权的渠道id
   *  @param {string} param.requestId - UUID
   *  @param {number} param.loginKdtId - 授权店铺，前端传当前登陆店铺kdtId（只有单店或连锁总部才具有授权能力）
   *  @param {string} param.operatorPhone - 操作人手机号
   *  @param {number} param.operatorId - 操作人ID
   *  @param {string} param.operatorName - 操作人姓名
   *  @return {Promise}
   */
  async deAuthorize(param) {
    return this.invoke('deAuthorize', [param]);
  }

  /**
   *  绑定门店
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1003307
   *
   *  @param {Object} param -
   *  @param {number} param.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId,有赞外卖1001，有赞商城1002 必须用常量 @see {@link SourceChannelEnum}
   *  @param {number} param.role - 操作人角色 system|buyer|seller|insider
   *  @param {string} param.fromApp - 请求来源app
   *  @param {number} param.deliveryChannel - 接入的物流渠道方：1.达达，2.蜂鸟，3.点我达 不允许为null {@link com.youzan.delivery.constants.TakeoutDeliveryChannelEnum}
   *  @param {string} param.idCard - 联系人身份证/
   *  @param {string} param.displayName - 应用展示名称
   *  @param {string} param.operatorPhone - 操作人手机号
   *  @param {string} param.operatorName - 操作人姓名
   *  @param {string} param.cityName - 城市名称(如,杭州市)
   *  @param {string} param.requestId - UUID
   *  @param {string} param.appId - 应用appid
   *  @param {Object} param.buyerGpsInfoParam - 买家经纬度来源
   *  @param {boolean} param.isCloudTag - 是否上云标
   *  @param {string} param.stationName - 门店名称
   *  @param {string} param.shopId - 第三方门店编号
   *  @param {number} param.operatorId - 操作人ID
   *  @param {string} param.lat - 门店纬度
   *  @param {string} param.countyName - 区域名称(如,西湖区)
   *  @param {number} param.business - 业务类型 {@link com.youzan.delivery.constants.TakeoutDeliveryBusinessEnum}
   *  @param {string} param.lng - 门店经度
   *  @param {number} param.kdtId - 口袋通id，有赞内部必填，必须唯一，用于结算运费
   *  @param {string} param.contactName - 联系人姓名
   *  @param {number} param.storeId - 门店编码，每个接入方保证唯一, 0 或 null 代表单店
   *  @param {string} param.stationAddress - 门店地址
   *  @param {number} param.headId - 总店id
   *  @param {number} param.positionSource - 经纬度来源, 1:腾讯地图, 2:百度地图, 3: 高德系 {@link TakeoutDeliveryPositionEnum}
   *  @param {string} param.phone - 联系人电话
   *  @param {string} param.partnerId - 商户号
   *  @param {string} param.provinceName - 省份名称(如,浙江省)
   *  @return {Promise}
   */
  async saveOrUpdateBandShop(param) {
    return this.invoke('saveOrUpdateBandShop', [param]);
  }
}

module.exports = TakeoutChannelService;
