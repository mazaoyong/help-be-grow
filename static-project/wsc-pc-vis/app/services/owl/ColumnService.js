const BaseService = require('../base/BaseService');

/**
 */
class ColumnService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.ColumnService';
  }

  /**
   * 课程提醒通知调用接口
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/197795
   *
   * @param {*} courseNoticeRequestDTO
   */
  async courseNotice(courseNoticeRequestDTO) {
    const result = await this.invoke('courseNotice', [courseNoticeRequestDTO]);
    return result;
  }
}

module.exports = ColumnService;
