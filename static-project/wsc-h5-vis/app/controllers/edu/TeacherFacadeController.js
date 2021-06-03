const BaseController = require('./EduBaseController');
const TeacherFacadeService = require('../../services/edu/TeacherFacadeService');

class TeacherFacadeController extends BaseController {
  /**
   * 获取老师的资料以及老师的课程列表
   * @param {object} ctx
   * @param {number} ctx.query.teacherId 老师id，需要根据老师id来查询其相关信息
   * @memberof TeacherFacadeController
   */
  async getTeacherInfoJson(ctx) {
    const { query, kdtId } = ctx;
    const { teacherId } = query;
    const payload = {
      kdtId,
      teacherIds: [Number(teacherId)],
    };

    // 老师信息
    const info = await new TeacherFacadeService(ctx).getTeacherInfo(payload);

    ctx.json(0, 'ok', info[0]);
  }

  /**
   * 获得更多的该教师的课程列表
   * @param {object} ctx
   * @param {number} ctx.query.teacherId 老师的id信息
   * @param {number} ctx.query.pageNumber 请求的页数
   * @memberof TeacherFacadeController
   */
  async loadMoreCourseJson(ctx) {
    const { query, kdtId } = ctx;
    const { teacherId, pageNumber } = query;

    const response = await new TeacherFacadeService(ctx).listCourseByTeacherId([
      {
        kdtId,
        teacherId: Number(teacherId),
      },
      {
        pageNumber: Number(pageNumber),
        pageSize: 10,
        sort: null,
      },
    ]);

    const list = (response && response.content) || [];
    const { offset } = response.pageable;
    const pageable = (offset + list.length) < response.total;

    ctx.json(0, 'ok', { list, pageable });
  }

  /**
   * 查询老师列表
   * @param {Object} ctx
   */
  async listTeacherForWym(ctx) {
    const { kdtId, request } = ctx;
    const { query } = request;
    const { teacherIds, source } = query;
    const requestDTO = {
      kdtId,
      keyword: query.title,
      source,
    };
    const pageRequest = {
      pageNumber: query.page,
      pageSize: query.page_size,
    };

    if (typeof teacherIds !== 'undefined') {
      requestDTO.teacherIds = teacherIds === '' ? [] : teacherIds.split(',');
    }
    const data = await new TeacherFacadeService(ctx).listTeacherForWym(requestDTO, pageRequest);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = TeacherFacadeController;
