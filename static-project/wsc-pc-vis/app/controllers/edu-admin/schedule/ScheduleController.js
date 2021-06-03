// 排课管理
const BaseController = require('../../base/BaseController');
const LessonService = require('../../../services/owl/pc/lesson/LessonService');
const NewLessonService = require('../../../services/api/owl/pc/LessonFacade');
const EduCourseFacadeService = require('../../../services/owl/pc/educourse/EduCourseFacadeService');
const ResourceFacadeService = require('../../../services/owl/pc/resource/ResourceFacadeService');
const StoreFacadeService = require('../../../services/owl/edu/course/StoreService');
const ScheduleFacadeService = require('../../../services/owl/pc/schedule/ScheduleFacadeService');
const ScheduleService = require('../../../services/owl/pc/schedule/ScheduleService');
const DateRangeConfigService = require('../../../services/owl/pc/schedule/DateRangeConfigService');
const PcBatchActionPollingService = require('../../../services/owl/pc/batchaction/PcBatchActionPollingService');

class ScheduleController extends BaseController {
  // 排课页面
  async getIndexHTML(ctx) {
    await ctx.render('edu-admin/schedule/index.html');
  }

  // 获取课节看板
  async findKanBanList(ctx) {
    const { kdtId } = ctx;
    const req = ctx.getQueryParse();
    const res = await new LessonService(ctx).findKanBanList(kdtId, req);
    return ctx.json(0, 'ok', res);
  }

  // 获取课节看板
  async findKanBanListV2(ctx) {
    const { kdtId } = ctx;
    const req = ctx.getQueryParse();
    const res = await new NewLessonService(ctx).findKanBanListV2(kdtId, req);
    return ctx.json(0, 'ok', res);
  }

  // 获取课节看板
  async findResourceKanBanPage(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query = {} } = ctx.getQueryParse();
    query.kdtId = query.kdtId || kdtId;
    const res = await new LessonService(ctx).findResourceKanBanPage(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', res);
  }

  // 获取课节看板V2
  async findResourceKanBanPageV2(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query = {} } = ctx.getQueryParse();
    query.kdtId = query.kdtId || kdtId;

    const res = await new NewLessonService(ctx).findResourceKanBanPageV2(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', res);
  }

  // 获取课程列表
  async getCourseListJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new EduCourseFacadeService(ctx).findPageByCondition(
      kdtId,
      pageRequest,
      query,
    );

    return ctx.json(0, 'ok', res);
  }

  // 获取班级列表（带冲突检测）
  async getCourseClassJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new ResourceFacadeService(ctx).findClassConflict(kdtId, pageRequest, query);

    return ctx.json(0, 'ok', res);
  }

  // 获取老师助教列表（带冲突检测）
  async getTeacherWithConflictJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new ResourceFacadeService(ctx).findTeacherConflict(kdtId, pageRequest, query);

    return ctx.json(0, 'ok', res);
  }

  // 获取上课门店信息）
  async getClassStoreJson(ctx) {
    const { kdtId } = ctx;
    const { keyword } = ctx.query;

    const res = await new StoreFacadeService(ctx).getStoreList({ keyword, kdtId });

    return ctx.json(0, 'ok', res);
  }

  // 获取教室列表（带冲突检测）
  async getClassroomWithConflictJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.request.body || {};

    const res = await new ResourceFacadeService(ctx).findClassroomConflict(
      kdtId,
      pageRequest,
      query,
    );

    return ctx.json(0, 'ok', res);
  }

  // 提交创建排课信息之前检测冲突
  async validateBeforeSaveOrModify(ctx) {
    const { kdtId } = ctx;
    const query = ctx.request.body || {};

    const res = await new ResourceFacadeService(ctx).checkResourceConflict(kdtId, query);

    return ctx.json(0, 'ok', res);
  }

  // 分页查询课节
  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { page, query = {} } = ctx.getQueryParse();
    const res = await new LessonService(ctx).findPageByCondition(kdtId, page, query);
    return ctx.json(0, 'ok', res);
  }

  // 创建排课
  async createSchedule(ctx) {
    const { kdtId } = ctx;
    const command = ctx.request.body || {};
    command.operator = this.formatOperator;
    const res = await new ScheduleFacadeService(ctx).createSchedule(kdtId, command);
    return ctx.json(0, 'ok', res);
  }

  // 编辑排课
  async updateSchedule(ctx) {
    const { kdtId } = ctx;
    const command = ctx.request.body || {};

    command.operator = this.formatOperator;

    const res = await new LessonService(ctx).updateSchedule(kdtId, command);

    return ctx.json(0, 'ok', res);
  }

  /// 轮询新建/编辑排课的结果
  async getActionResultJson(ctx) {
    const { kdtId } = ctx;
    const { taskNo, kdtId: targetKdtId } = ctx.query || {};

    const queryData = {
      taskNo,
      kdtId: targetKdtId,
    };

    const res = await new PcBatchActionPollingService(ctx).getActionResultV2(kdtId, queryData);

    return ctx.json(0, 'ok', res);
  }

  // 删除课节
  async deleteLesson(ctx) {
    const { kdtId } = ctx;
    const { lessonNo, scheduleId, operateType = 1, kdtId: targetKdtId } = ctx.request.body || {};

    const res = await new LessonService(ctx).deleteLesson(kdtId, {
      operator: this.formatOperator,
      lessonNo,
      scheduleId,
      operateType,
      kdtId: targetKdtId,
    });
    return ctx.json(0, 'ok', res);
  }

  // 查询排课详情
  async getScheduleDetailJson(ctx) {
    const { kdtId } = ctx;
    const { lessonNo } = ctx.query;

    const queryDate = {
      lessonNo: lessonNo,
      kdtId: ctx.query.kdtId,
    };

    const res = await new LessonService(ctx).getLessonDetailV2(kdtId, queryDate);

    return ctx.json(0, 'ok', res);
  }

  // 导出排课课表
  async exportSchedules(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body || {};

    const { operatorPhone: operatorMobile, operatorName } = this.operator;

    const res = await new ScheduleService(ctx).exportSchedules(kdtId, {
      ...req,
      operatorMobile,
      operatorName,
    });

    return ctx.json(0, 'ok', res);
  }

  // 获取时间段数据
  async getDateRangeConfig(ctx) {
    const { kdtId } = ctx;

    const res = await new DateRangeConfigService(ctx).findByKdtId(kdtId);

    return ctx.json(0, 'ok', res);
  }

  // 批量删除课节
  async batchDeleteLesson(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body || {};

    const lessonBatchDeleteCommand = {
      lessonDeleteModelList: req.lessonDeleteModelList,
      operator: this.operator,
    };

    const res = await new LessonService(ctx).batchDeleteLesson(kdtId, lessonBatchDeleteCommand);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = ScheduleController;
