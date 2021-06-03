const BaseService = require('../base/BaseService');

/**
 * com.youzan.ic.delivery.service.TakeoutDeliveryService
 */
class TakeoutDeliveryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.TakeoutDeliveryService';
  }

  /**
   *  根据kdtId,sourceId,storeId找到对应门店记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/142150
   *
   *  @param {Object} shopFindParam - 查询参数
   *  @param {number} shopFindParam.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId
   *  @param {number} shopFindParam.kdtId - 店铺口袋通id
   *  @param {string} shopFindParam.fromApp - 请求来源app
   *  @param {string} shopFindParam.requestId - UUID
   *  @param {number} shopFindParam.storeId - 多店铺的门店编号
   *  @return {Promise}
   */
  async findShop(shopFindParam) {
    return this.invoke('findShop', [shopFindParam]);
  }

  /**
   *  创建物流门店（不同步到第三方）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/142148
   *
   *  @param {Object} shopCreateParam - 门店创建参数
   *  @param {number} shopCreateParam.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId,有赞外卖1001，有赞商城1002
   *  @param {number} shopCreateParam.business - 业务类型(餐饮 - 1)暂时只支持餐饮
   *  @param {string} shopCreateParam.lng - 门店经度
   *  @param {number} shopCreateParam.httpTimeOut - UUID
   *  @param {number} shopCreateParam.kdtId - 口袋通id，有赞内部必填，必须唯一，用于结算运费
   *  @param {string} shopCreateParam.fromApp - 请求来源app
   *  @param {number} shopCreateParam.deliveryChannel - 接入的物流渠道方：1.达达，2.蜂鸟，如果为null表示全部渠道
   *  @param {string} shopCreateParam.contactName - 联系人姓名
   *  @param {string} shopCreateParam.idCard - 联系人身份证/
   *  @param {number} shopCreateParam.storeId - 门店编码，每个接入方保证唯一
   *  @param {string} shopCreateParam.stationAddress - 门店地址
   *  @param {string} shopCreateParam.cityName - 城市名称(如,杭州市)
   *  @param {number} shopCreateParam.positionSource - 经纬度来源, 1:腾讯地图, 2:百度地图, 3:高德地图暂时只支持 3 高德系
   *  @param {string} shopCreateParam.phone - 联系人电话
   *  @param {string} shopCreateParam.requestId - UUID
   *  @param {string} shopCreateParam.stationName - 门店名称
   *  @param {string} shopCreateParam.provinceName - 省份名称(如,浙江省)
   *  @param {string} shopCreateParam.lat - 门店纬度
   *  @param {string} shopCreateParam.countyName - 区域名称(如,西湖区)
   *  @return {Promise}
   */
  async createLocalShop(shopCreateParam) {
    return this.invoke('createLocalShop', [shopCreateParam]);
  }

  /**
   *  更新门店信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/19246
   *
   *  @param {Object} shopUpdateParam - 更新参数
   *  @param {number} shopUpdateParam.sourceId - 接入来源，每个接入方接入前都会先分配一个sourceId
   *  @param {number} shopUpdateParam.business - 业务类型(餐饮 - 1)暂时只支持餐饮
   *  @param {string} shopUpdateParam.lng - 门店经度
   *  @param {number} shopUpdateParam.kdtId - 店铺口袋通id
   *  @param {string} shopUpdateParam.fromApp - 请求来源app
   *  @param {string} shopUpdateParam.contactName - 联系人姓名
   *  @param {number} shopUpdateParam.storeId - 多店铺的门店编号
   *  @param {string} shopUpdateParam.stationAddress - 门店地址
   *  @param {string} shopUpdateParam.cityName - 城市名称(如,杭州市)
   *  @param {number} shopUpdateParam.positionSource - 经纬度来源, 1:腾讯地图, 2:百度地图, 3:高德地图暂时只支持 3 高德系
   *  @param {string} shopUpdateParam.phone - 联系人电话
   *  @param {string} shopUpdateParam.requestId - UUID
   *  @param {string} shopUpdateParam.stationName - 门店名称
   *  @param {string} shopUpdateParam.provinceName - 省份名称(如,浙江省)
   *  @param {string} shopUpdateParam.lat - 门店纬度
   *  @param {string} shopUpdateParam.countyName - 区域名称(如,西湖区)
   *  @return {Promise}
   */
  async updateShop(shopUpdateParam) {
    return this.invoke('updateShop', [shopUpdateParam]);
  }
}

module.exports = TakeoutDeliveryService;
