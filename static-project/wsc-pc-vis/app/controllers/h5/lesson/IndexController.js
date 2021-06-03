const PCTeacherFacade = require('../../../services/api/owl/pc/TeacherFacade');
const TeacherFacade = require('../../../services/api/owl/api/TeacherFacade');
const SignInFacade = require('../../../services/api/owl/pc/SignInFacade');
const utilsShop = require('@youzan/utils-shop');
const { checkChainStore } = utilsShop;
/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const SignInService = require('../../../services/owl/pc/signin/SignInService');

class IndexController extends BaseController {
  /**
   * 课表页面
   */
  async getIndexHtml(ctx) {
    if (checkChainStore(ctx.getState('shopInfo'))) {
      await this.setCampusInfo(ctx);
    }
    await ctx.render('h5/lesson-list.html');
  }

  /**
   * 获取日历对应的课程时间
   */
  async getDateList(ctx) {
    const { kdtId = 0 } = ctx;
    const { isTeacher, startTime, endTime } = ctx.query;
    let dto = {
      startTime: `${startTime} 00:00:00`,
      endTime: `${endTime} 00:00:00`,
    };
    if (isTeacher === 'true') {
      // 如果角色是老师，则只获取老师的课表，否则获取机构的课表
      const { id: teacherId } = ctx.getLocalSession('userInfo');
      dto = Object.assign({}, dto, { teacherId });
    }
    const res = await new SignInService(ctx).findDateOfLessonKanBan(kdtId, dto);

    return ctx.json(0, 'ok', res);
  }

  /**
   * 对应时间的课程列表
   */
  async getLessons(ctx) {
    const { kdtId = 0 } = ctx;
    const { isTeacher, pageNumber, pageSize, queryDate } = ctx.query;
    const page = {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };
    let query = {
      queryDate: `${queryDate} 00:00:00`,
    };
    if (isTeacher === 'true') {
      const { id: teacherId } = ctx.getLocalSession('userInfo');
      query = Object.assign({}, query, { teacherId });
    }
    const res = await new SignInService(ctx).findLessons(kdtId, page, query);

    const content = (res && res.content) || [];
    const { offset } = res.pageable;
    const pageable = offset + content.length < res.total;

    return ctx.json(0, 'ok', { content, pageable });
  }

  /** @description 机构签到课程表看板查询某天的课表 V2 添加老师或助教查询 */
  async getFindLessonsV2Json(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      isTeacher,
      teacherIds = [],
      pageNumber,
      pageSize,
      queryDate,
      assistantIds = [],
    } = ctx.getQueryParse();

    const pageRequest = {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };
    let query = {
      queryDate: `${queryDate} 00:00:00`,
      teacherIds: teacherIds.map(item => Number(item)),
      assistantIds: assistantIds.map(item => Number(item)),
    };
    if (isTeacher === 'true') {
      const { id: teacherId } = ctx.getLocalSession('userInfo');
      query = Object.assign({}, query, { teacherId });
    }
    const lessonsForSignInQuery = { ...query, kdtId };

    const result = await new SignInFacade(ctx).findLessonsV2(
      kdtId,
      pageRequest,
      lessonsForSignInQuery,
    );
    ctx.success(result);
  }

  /** @description 机构端查询有安排课程的日期，在课程看板上打点所用 V2 添加老师或助教查询 */
  async getFindDateOfLessonKanBanV2Json(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      isTeacher,
      startTime,
      endTime,
      teacherIds = [],
      assistantIds = [],
    } = ctx.getQueryParse();
    let lessonKanBan = {
      startTime,
      endTime,
      teacherIds: teacherIds.map(item => Number(item)),
      assistantIds: assistantIds.map(item => Number(item)),
    };
    if (isTeacher === 'true') {
      // 如果角色是老师，则只获取老师的课表，否则获取机构的课表
      const { id: teacherId } = ctx.getLocalSession('userInfo');
      lessonKanBan = Object.assign({}, lessonKanBan, { teacherId });
    }
    const result = await new SignInFacade(ctx).findDateOfLessonKanBanV2(kdtId, lessonKanBan);
    ctx.success(result);
  }

  /** @description 根据query条件查询教师列表 */
  async getFindPageJson(ctx) {
    const { kdtId = 0 } = ctx;
    const { pageNumber, pageSize, keyword, source = 0 } = ctx.getQueryParse();
    const pageRequest = {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const query = { keyword, kdtId: kdtId, source };

    const result = await new TeacherFacade(ctx).findPage(kdtId, pageRequest, query);
    ctx.success(result);
  }

  /** @description 根据query条件查询助教列表 */
  async getFindAssistantPageJson(ctx) {
    const { kdtId = 0 } = ctx;
    const { pageNumber, pageSize, keyword, source = 0 } = ctx.getQueryParse();
    const pageRequest = {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };
    const query = { keyword, kdtId: kdtId, source };

    const result = await new PCTeacherFacade(ctx).findAssistantPage(kdtId, pageRequest, query);
    ctx.success(result);
  }
}

module.exports = IndexController;
