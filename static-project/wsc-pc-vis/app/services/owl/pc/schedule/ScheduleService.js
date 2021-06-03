const BaseService = require('../../../base/BaseService');

/**
 * 课表
 */
class ScheduleService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.schedule.ScheduleFacade';
  }

  /**
   *  findPageStuScheduleByStuId b端创建预约
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/363968
   *
   *  @param {number} kdtId -
   *  @param {Object} scheduleQuery -
   *  @param {number} scheduleQuery.studentUid - 学生userId
   *  @param {string} scheduleQuery.assetNo - 资产编号，从列表页可以拿到
   *  @param {number} scheduleQuery.userId - 客户id
   *  @param {number} scheduleQuery.status - 状态
   *  @return {Promise}
   */
  async findPageStuScheduleByStuId(kdtId, scheduleQuery) {
    return this.invoke('findPageStuScheduleByStuId', [kdtId, scheduleQuery]);
  }

  /**
   * 导出排课课表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/365893
   *
   * @param {number} kdtId - 店铺 id
   * @param {Object} query - 查询参数
   * @param {number} query.startTime - 开始时间
   * @param {number} query.endTime - 结束时间
   * @param {string} query.eduCourseName - 教务课程名称
   * @param {string} query.lessonName -课节名称
   * @param {string} query.classNo - 班级编号
   * @param {string} query.classroomNo - 教室编号
   * @param {string} query.teacherNo - 老师编号
   * @param {number} query.addressId - 网店地点
   * @param {string} query.operatorMobile - 导出人手机号
   * @param {string} query.operatorName - 导出人用户名
   * @param {1|2} query.appointRule - 预约规则: 1:需预约,2:不需
   */
  async exportSchedules(kdtId, query) {
    return this.invoke('exportSchedules', [kdtId, query]);
  }
}

module.exports = ScheduleService;
