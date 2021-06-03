const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.lesson.StudentLessonFacade */
class StudentLessonFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.lesson.StudentLessonFacade';
  }

  /**
   * 批量取消学员课表
   * @link http://zanapi.qima-inc.com/site/service/view/1044984
   * @param {number} kdtId -
   * @param {Object} command - 批量取消学员课表
   * @param {number} command.kdtId - 校区店铺id
   * @param {Array} command.studentLessonNos - 学员课表编号list
   * @param {Object} command.operator - 操作者信息
   * @return {Promise}
   */
  async batchCancelV2(kdtId, command) {
    return this.invoke('batchCancelV2', [kdtId, command]);
  }
}

module.exports = StudentLessonFacade;
