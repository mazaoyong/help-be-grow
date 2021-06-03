const BaseController = require('../../base/BaseController');
const EduClassService = require('../../../services/owl/edu/educlass/EduClassService');
const CourseServiceV2 = require('../../../services/owl/edu/course/CourseServiceV2');

class CourseController extends BaseController {
  // pc端编辑课程查询课程详情 TOCLEAR
  async getCoursePCDetailJson(ctx) {
    const params = {
      kdtId: ctx.request.query.kdtId || ctx.kdtId,
      alias: ctx.request.query.alias,
      userId: ctx.request.query.userId || 0,
    };

    const data = await new CourseServiceV2(ctx).getCoursePCDetail(ctx.kdtId, params);
    ctx.json(0, 'ok', data);
  }

  /**
   *  获取指定课程关联班级列表
   *
   * @param {Object} ctx
   * @param {string[=asc]} ctx.query.id 课程id
   * @returns
   * @memberof CourseController
   */
  async findEduClassByCondition(ctx) {
    const { kdtId = '' } = ctx;
    const { page, query = {} } = ctx.getQueryParse();
    if (!query.kdtId) {
      query.kdtId = kdtId;
    }
    const data = await new EduClassService(ctx).findEduClassByCondition(kdtId, page, query);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = CourseController;
