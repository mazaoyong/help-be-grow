const BaseService = require('../../../base/BaseService');

/**
 * customer base service
 */
class StudentCourseService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.student.StudentCourseFacade';
  }

  /**
   * 分页查询预约课程列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/230370
   * @param {Object} params - 请求参数
   * @param {Object} pageable - 分页相关参数
   * @param {number} kdtId - 店铺 Id
   * @return {Promise<Object>}
   */
  async findPageByCondition(params, pageable, kdtId) {
    const res = await this.invoke('findPageByCondition', [params, pageable, kdtId]);
    return res;
  }

  /**
   *  获取学员一月课程
   *
   * @see http://zanapi.qima-inc.com/site/service/view/226415
   * @param {number} kdtId
   * @param {number} customerUserId - 学员的 userId
   * @param {number} year - 年
   * @param {number} month - 月
   * @return {Promise<Object>}
   */
  async findOneMonth(kdtId, customerUserId, year, month) {
    const res = await this.invoke('findInOneMonth', [{ kdtId, customerUserId, year, month }]);
    return res;
  }
}

module.exports = StudentCourseService;
