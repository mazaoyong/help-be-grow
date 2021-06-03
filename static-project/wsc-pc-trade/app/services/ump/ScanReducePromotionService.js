const BaseService = require('../base/BaseService');
/**
 * 扫码收款 优惠相关接口
 */
class ScanReducePromotionService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.marketing.scanreduce.service.ScanReducePromotionService';
  }

  /**
   *  分页获取收款码优惠列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/492472
   *
   *  @param {number} kdtId - 店铺 Id
   *  @param {number} pageNo - 页码数，默认为第 1 页
   *  @param {number} pageSize - 每页条数
   *  @return {Promise}
   */
  async getScanReduceList(kdtId, pageNo, pageSize) {
    return this.invoke('getScanReduceList', [kdtId, pageNo, pageSize]);
  }

  /**
   *  创建优惠活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/164523
   *
   *  @param {Object} inputScanReduce -
   *  @param {number} inputScanReduce.kdtId - 店铺id
   *  @param {number} inputScanReduce.reduceQuota - 优惠立减金额，0表示未设置减免金额
   *  @param {boolean} inputScanReduce.enable - 是否启用
   *  @param {number} inputScanReduce.limitQuota - 优惠上限，0表示无限制
   *  @param {number} inputScanReduce.discount - 折扣值，0表示未设置折扣
   *  @param {string} inputScanReduce.scanType - 优惠类型
   *  @param {number} inputScanReduce.meetQuota - 优惠门槛，0表示不限制
   *  @param {string} inputScanReduce.present - 赠品信息
   *  @param {boolean} inputScanReduce.canRepeat - 是否是每满meetQuota元都可享受
   *  @param {number} inputScanReduce.qrcodeId - 二维码id
   *  @return {Promise}
   */
  async create(inputScanReduce) {
    return this.invoke('create', [inputScanReduce]);
  }

  /**
   *  编辑优惠活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/164524
   *
   *  @param {number} activityId -
   *  @param {Object} inputScanReduce -
   *  @param {number} inputScanReduce.kdtId - 店铺id
   *  @param {number} inputScanReduce.reduceQuota - 优惠立减金额，0表示未设置减免金额
   *  @param {boolean} inputScanReduce.enable - 是否启用
   *  @param {number} inputScanReduce.limitQuota - 优惠上限，0表示无限制
   *  @param {number} inputScanReduce.discount - 折扣值，0表示未设置折扣
   *  @param {string} inputScanReduce.scanType - 优惠类型
   *  @param {number} inputScanReduce.meetQuota - 优惠门槛，0表示不限制
   *  @param {string} inputScanReduce.present - 赠品信息
   *  @param {boolean} inputScanReduce.canRepeat - 是否是每满meetQuota元都可享受
   *  @param {number} inputScanReduce.qrcodeId - 二维码id
   *  @return {Promise}
   */
  async edit(activityId, inputScanReduce) {
    return this.invoke('edit', [activityId, inputScanReduce]);
  }

  /**
   *  优惠活动失效
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/515365
   *
   *  @param {number} kdtId -
   *  @param {number} activityId -
   *  @return {Promise}
   */
  async invalidV2(kdtId, activityId) {
    return this.invoke('invalidV2', [kdtId, activityId]);
  }

  /**
   *  获取当前优惠活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/515366
   *
   *  @param {number} kdtId -
   *  @param {string} scanType -
   *  @return {Promise}
   */
  async getValidByScanTypeV2(kdtId, scanType) {
    return this.invoke('getValidByScanTypeV2', [kdtId, scanType]);
  }
}

module.exports = ScanReducePromotionService;
