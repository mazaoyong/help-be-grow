const BaseService = require('../base/BaseService');

/**
 * com.youzan.multistore.center.api.service.setting.MultiStoreSettingService
 */
class MultiStoreSettingService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.multistore.center.api.service.setting.MultiStoreSettingService';
  }

  /**
   *  根据kdtId获取网点的设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/87290
   *  接口文档地址 ： https://doc.qima-inc.com/pages/viewpage.action?pageId=48268516
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async getMultiStoreSettingsByKdtId(kdtId) {
    return this.invoke('getMultiStoreSettingsByKdtId', [kdtId]);
  }
}

module.exports = MultiStoreSettingService;
