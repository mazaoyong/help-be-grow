const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.student.StudentFacade */
class StudentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentFacade';
  }

  /**
   * 提交报读列表导出任务
   * @link http://zanapi.qima-inc.com/site/service/view/1011289
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {number} query.applyCourseId - 适用课程id
   * @param {string} query.endRecentStudyTime - 最近上课时间结束日期
   * @param {Array} query.extraAndQuery - 附加查询条件
   * @param {string} query.endRegisterTime - 结束报名时间
   * @param {number} query.minCourseTime - 剩余最小课时
   * @param {number} query.minEffectiveDay - 最小有效天数
   * @param {number} query.sellerId - 课程顾问id（销售员姓名id）
   * @param {number} query.isDeleted - 是否删除,0:未删除，1：删除
   * @param {Array} query.courseStatuses - 多课程状态查询
   * @param {number} query.maxCourseTime - 剩余最大课时
   * @param {string} query.validityBeginMin - 有效期最小开始时间
   * @param {number} query.maxEffectiveDay - 最大有效天数
   * @param {number} query.totalValue - 总学费
   * @param {number} query.eduClassId - 所在班级
   * @param {string} query.nickName - 用户名称（操作人）
   * @param {number} query.remainingValue - 剩余学费
   * @param {string} query.query - 学员姓名/手机号
   * @param {string} query.mobile - 用户手机号（操作人）
   * @param {number} query.userId - 学员userId
   * @param {string} query.validityBeginMax - 有效期最大开始时间
   * @param {string} query.validityEndMax - 有效期最大结束时间
   * @param {Array} query.courseSellTypes - 收费方式，组合
   * @param {Array} query.kdtIds - 店铺id集合
   * @param {number} query.courseSellType - 收费方式,0:自定义 1:按课时 2:按时间段 3:按期
   * @param {string} query.startRecentStudyTime - 最近上课时间开始日期
   * @param {string} query.courseName - 线下课名
   * @param {number} query.courseStatus - 课程状态，1:已学完,2:未开始,3:进行中,4:已退课
   * @param {number} query.enrollmentType - 报名类型，1新报 2转课 3续费
   * @param {string} query.startRegisterTime - 开始报名时间
   * @param {Object} query.filterType - 不同业务的过滤处理
   * @param {string} query.validityEndMin - 有效期最小结束时间
   * @return {Promise}
   */
  async submitSignUpReadExportTask(kdtId, pageRequest, query) {
    return this.invoke('submitSignUpReadExportTask', [kdtId, pageRequest, query]);
  }
}

module.exports = StudentFacade;
