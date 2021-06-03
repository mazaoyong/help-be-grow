const BaseController = require('../../../base/BaseController');
const PcCourseFacade = require('../../../../services/owl/pc/courseitem/offlinecourse/PcCourseFacade');
const CourseProductService = require('../../../../services/owl/edu/course/CourseProductService');

class CourseProductController extends BaseController {
  // 查询课程列表 TOCLEAR
  async getCourseListJson(ctx) {
    const kdtId = ctx.kdtId;
    const { page, size, ...rest } = ctx.request.query || {};
    if (!rest.kdtId) {
      rest.kdtId = kdtId;
    }
    const res = await new CourseProductService(ctx).listCourse(
      kdtId,
      { ...rest },
      { pageNumber: page, pageSize: size },
    );

    return ctx.json(0, 'ok', res);
  }

  // 线下课列表查询，不带商品锁信息
  async findPageByCondition(ctx) {
    const { kdtId } = ctx.kdtId;
    const { page, size, ...courseQuery } = ctx.request.query || {};
    if (courseQuery.kdtId) {
      courseQuery.campusKdtId = courseQuery.kdtId;
      delete courseQuery.kdtId;
    }
    const pageRequest = {
      pageNumber: page,
      pageSize: size,
    };

    const result = await new PcCourseFacade(ctx).findPageByCondition(kdtId, courseQuery, pageRequest);
    return ctx.json(0, 'ok', result);
  }
}

module.exports = CourseProductController;
