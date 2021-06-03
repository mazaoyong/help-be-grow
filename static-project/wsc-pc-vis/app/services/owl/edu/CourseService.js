const BaseService = require('../../base/BaseService');

/**
 *
 * @class CourseFacade
 * @extends {BaseService}
 */
class CourseService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.CourseFacade';
  }

  /**
   *  pc端编辑课程查询课程详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/221230
   *
   *  @param {Object} req -
   *  @param {number} req.kdtId - 店铺id
   *  @param {string} req.alias - 课程alias
   *  @param {number} req.userId - 用户id
   *  @return {Object}
   */
  async getCoursePCDetail(req) {
    return this.invoke('getCoursePCDetail', [req]);
  }
}

module.exports = CourseService;
