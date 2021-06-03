const EduBaseService = require('./EduBaseService');

class CourseScheduleService extends EduBaseService {
  get STUDENT_COURSE_FACADE_SERVICE() {
    return 'com.youzan.owl.edu.api.student.StudentCourseFacade';
  }

  /**
   * 查询客户某月有预约课的日期列表
   * @see http://zanapi.qima-inc.com/site/service/view/230373
   * @param {number} kdtId - 店铺 ID
   * @param {string} customerUserId - 用户 ID
   * @param {number} year
   * @param {number} month
   */
  async findDatesInOneMonth(kdtId, customerUserId, year, month) {
    const result = await this.invoke(this.STUDENT_COURSE_FACADE_SERVICE, 'findDatesInOneMonth', [{
      kdtId, customerUserId, year, month,
    }]);

    return result;
  }

  /**
   * 查询客户某日的预约课程列表
   * @see http://zanapi.qima-inc.com/site/service/view/230372
   * @param {number} kdtId - 店铺 ID
   * @param {string} customerUserId - 用户 ID
   * @param {string} date - 日期
   */
  async findInOneDay(kdtId, customerUserId, date) {
    const result = await this.invoke(this.STUDENT_COURSE_FACADE_SERVICE, 'findInOneDay', [{ kdtId, customerUserId, date }]);

    return result;
  }

  /**
   * 查询客户没有预约时间的课程列表
   * @see http://zanapi.qima-inc.com/site/service/view/231193
   * @param {number} kdtId - 店铺 ID
   * @param {string} customerUserId - 用户 ID
   */
  async findWithoutAppointTime(kdtId, customerUserId) {
    const result = await this.invoke(this.STUDENT_COURSE_FACADE_SERVICE, 'findWithoutAppointTime', [{ kdtId, customerUserId }]);

    return result;
  }
}

module.exports = CourseScheduleService;
