const BaseService = require('../../../../base/BaseService');

class ScheduleFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.schedule.ScheduleFacade';
  }

  /**
   *  课程list
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/364978
   *
   *  @param {number} kdtId -
   *  @param {Object} scheduleQuery -
   *  @param {Array.<Array>} scheduleQuery.studentUid[] - 学生userId
   *  @param {string} scheduleQuery.assetNo - 资产编号，从列表页可以拿到
   *  @param {number} scheduleQuery.userId - 客户id
   *  @param {number} scheduleQuery.status - 状态
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageStuSchedule(kdtId, scheduleQuery, pageRequest) {
    return this.invoke('findPageStuSchedule', [
      kdtId,
      scheduleQuery,
      pageRequest,
    ]);
  }

  /**
   *  课程详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/364979
   *
   *  @param {number} kdtId -
   *  @param {Object} scheduleQuery -
   *  @param {Array.<Array>} scheduleQuery.studentUid[] - 学生userId
   *  @param {Array} scheduleQuery.studentUid[] -
   *  @param {string} scheduleQuery.assetNo - 资产编号，从列表页可以拿到
   *  @param {number} scheduleQuery.userId - 客户id
   *  @param {number} scheduleQuery.status - 状态
   *  @return {Promise}
   */
  async findStuScheduleByCondition(kdtId, scheduleQuery) {
    return this.invoke('findStuScheduleByCondition', [kdtId, scheduleQuery]);
  }

  /**
   *  分页查询待上课时间
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/460639
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} scheduleQuery -
   *  @param {Array.<Array>} scheduleQuery.studentUid[] - 学生userId
   *  @param {string} scheduleQuery.assetNo - 资产编号，从列表页可以拿到
   *  @param {number} scheduleQuery.userId - 客户id
   *  @param {number} scheduleQuery.status - 状态
   *  @return {Promise}
   */
  async findWaitingLessonPage(kdtId, pageRequest, scheduleQuery) {
    return this.invoke('findWaitingLessonPage', [
      kdtId,
      pageRequest,
      scheduleQuery,
    ]);
  }
}

module.exports = ScheduleFacade;
