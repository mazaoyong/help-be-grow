const BaseController = require('../../base/BaseController');
const TeacherFacade = require('../../../services/owl/pc/teacher/TeacherFacade');
const TeacherService = require('../../../services/owl/edu/TeacherService');
const NewTeacherFacade = require('../../../services/api/owl/pc/TeacherFacade');

class TeacherController extends BaseController {
  // 查询老师列表
  async find(ctx) {
    const { kdtId } = ctx;
    const { keyword, source = 0, teacherIds, kdtId: targetKdtId } = ctx.getQueryParse();

    const req = { source };

    if (keyword && keyword !== '') {
      req.keyword = keyword;
    }

    if (teacherIds && Array.isArray(teacherIds)) {
      req.teacherIds = teacherIds;
    }

    req.kdtId = targetKdtId;

    const res = await new TeacherFacade(ctx).find(kdtId, req);
    return ctx.json(0, 'ok', res);
  }

  // 查询老师列表(分页) - 可选择是否有排课的老师
  async findTeachers(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query = {} } = ctx.getQueryParse();
    const { keyword, hasLesson = 0, eduCourseIds, kdtId: targetKdtId } = query;

    const req = { hasLesson };

    req.keyword = keyword || null;
    req.eduCourseIds = eduCourseIds || null;
    req.kdtId = targetKdtId;

    const res = await new TeacherFacade(ctx).findCourseTeacherPage(kdtId, pageRequest, req);
    return ctx.json(0, 'ok', res);
  }

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
    const data = await new TeacherService(ctx).listTeacherForWym(requestDTO, pageRequest);
    return ctx.json(0, 'ok', data);
  }

  /** @description 根据query条件查询教师列表 */
  async getFindPageJson(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query = {} } = ctx.getQueryParse();
    const { keyword, source = 0, teacherIds, kdtId: targetKdtId } = query;

    const req = { source };

    if (keyword && keyword !== '') {
      req.keyword = keyword;
    }

    if (teacherIds && Array.isArray(teacherIds)) {
      req.teacherIds = teacherIds;
    }

    req.kdtId = targetKdtId;
    const res = await new TeacherFacade(ctx).findPage(kdtId, pageRequest, req);
    return ctx.json(0, 'ok', res);
  }

  /** @description 根据query条件查询助教列表 */
  async getFindAssistantPageJson(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query = {} } = ctx.getQueryParse();
    const { keyword, source = 0, teacherIds, kdtId: targetKdtId } = query;

    const req = { source };

    if (keyword && keyword !== '') {
      req.keyword = keyword;
    }

    if (teacherIds && Array.isArray(teacherIds)) {
      req.teacherIds = teacherIds;
    }

    req.kdtId = targetKdtId;
    const res = await new NewTeacherFacade(ctx).findAssistantPage(kdtId, pageRequest, req);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = TeacherController;
