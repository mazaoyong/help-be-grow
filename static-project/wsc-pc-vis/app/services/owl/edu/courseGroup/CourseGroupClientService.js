const BaseService = require('../../../base/BaseService');

class CourseGroupClientService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.coursegroup.CourseGroupFacade';
  }

  /**
   *  生成课程分组推广的二维码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/452652
   *
   *  @param {number} kdtId -
   *  @param {Object} qrcodeCreateCommand -
   *  @param {number} qrcodeCreateCommand.kdtId - 目标店铺ID,用于区分连锁
   *  @param {string} qrcodeCreateCommand.alias - 课程分组alias
   *  @return {Promise}
   */
  async createQrcode(kdtId, qrcodeCreateCommand) {
    return this.invoke('createQrcode', [kdtId, qrcodeCreateCommand]);
  }
};

module.exports = CourseGroupClientService;
