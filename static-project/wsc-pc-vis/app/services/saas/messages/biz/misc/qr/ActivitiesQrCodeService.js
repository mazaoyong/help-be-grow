const BaseService = require('../../../../../base/BaseService');

/**
 *  com.youzan.saas.message.biz.misc.api.qr.ActivitiesQrCodeService
 * */
class ActivitiesQrCodeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.saas.message.biz.misc.api.qr.ActivitiesQrCodeService';
  }

  /**
   *  获取活码名称
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/354549
   *
   *  @param {number} kdtId -
   *  @param {number} activityId -
   *  @return {Promise}
   */
  async getActivityName(kdtId, activityId) {
    return this.invoke('getActivityName', [kdtId, activityId]);
  }
}

module.exports = ActivitiesQrCodeService;
