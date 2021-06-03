const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.client.edu.student.OwlStudentLessonDetectFacade -  */
class OwlStudentLessonDetectFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.student.OwlStudentLessonDetectFacade';
  }

  /**
   *  用户合约时间冲突检测
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/496414
   *
   *  @param {number} operatorKdtId - 操作者店铺id
   *  @param {Object} command - 检测查询参数
   *  @param {number} command.kdtId - 操作校区id
   *  @param {string} command.startTime - 待预约日程开始时间
   *  @param {Array.<Array>} command.studentIds[] - 待预约学员id列表
   *  @param {Array} command.studentIds[] -
   *  @param {string} command.endTime - 待预约日程结束时间
   *  @return {Promise}
   */
  async detectDateRange(operatorKdtId, command) {
    return this.invoke('detectDateRange', [operatorKdtId, command]);
  }
}

module.exports = OwlStudentLessonDetectFacade;
