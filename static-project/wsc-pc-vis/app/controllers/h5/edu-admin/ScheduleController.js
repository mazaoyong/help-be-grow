const BaseController = require('../base/BaseController');
const BatchActionPollingService = require('../../../services/owl/pc/batchaction/BatchActionPollingService');
const SignInFacade = require('../../../services/owl/pc/signin/SignInFacade');
const StudentLessonService = require('../../../services/owl/pc/lesson/StudentLessonService');
const ResourceFacadeService = require('../../../services/owl/pc/resource/ResourceFacadeService');
const StoreFacadeService = require('../../../services/owl/edu/course/StoreService');
const ScheduleFacadeService = require('../../../services/owl/pc/schedule/ScheduleFacadeService');
const ShopQueryService = require('../../../services/owl/pc/shop/ShopQueryService.js');
const PcBatchActionPollingService = require('../../../services/owl/pc/batchaction/PcBatchActionPollingService');
const EduCourseService = require('../../../services/owl/edu/educourse/EduCourseService');
const LessonService = require('../../../services/owl/pc/lesson/LessonService');

class IndexController extends BaseController {
  async findLittlePage(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      pageSize,
      page,
      kdtId: targetKdtId,
      assetNos,
      startTime,
      endTime,
    } = ctx.getQueryParse();
    const res = await new StudentLessonService(ctx).findLittlePage(kdtId, {
      pageNumber: page,
      pageSize,
    }, {
      assetNos,
      startTime: Number(startTime),
      endTime: Number(endTime),
      kdtId: targetKdtId,
    });
    return ctx.json(0, 'ok', res);
  }

  async getBatchSignInResult(ctx) {
    const { kdtId = 0 } = ctx;
    const operator = this.formatOperator;
    const {
      kdtId: targetKdtId,
      taskNo,
    } = ctx.query;
    const res = await new BatchActionPollingService(ctx).getBatchSignInResult(kdtId, {
      operator,
      taskNo,
      kdtId: targetKdtId,
    });
    return ctx.json(0, 'ok', res);
  }

  async getSignInResult(ctx) {
    const { kdtId = 0 } = ctx;
    const operator = this.formatOperator;
    const {
      kdtId: targetKdtId,
      taskNo,
    } = ctx.query;
    const res = await new BatchActionPollingService(ctx).getSignInResult(kdtId, {
      operator,
      taskNo,
      kdtId: targetKdtId,
    });
    return ctx.json(0, 'ok', res);
  }

  async businessBatchSignInV2(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      signInType,
      lessonNo,
      kdtId: targetKdtId,
      signInAllStudents,
      studentLessonNos,
    } = ctx.request.body;

    const dto = {
      lessonNo,
      operatorId: this.formatOperator.userId,
      operator: this.formatOperator,
      signInType,
      kdtId: targetKdtId,
    };

    console.log('typeof signInAllStudents', typeof signInAllStudents, signInAllStudents);

    if (signInAllStudents) { // 全部学员签到
      dto.signInAllStudents = signInAllStudents;
    } else {
      dto.studentLessonNos = studentLessonNos;
    }
    const res = await new SignInFacade(ctx).businessBatchSignInV2(kdtId, dto);
    return ctx.json(0, 'ok', res);
  }

  async getSignInTip(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      kdtId: targetKdtId,
      signInType,
      lessonNo,
      studentLessonNo,
    } = ctx.query;
    const res = await new SignInFacade(ctx).getSignInTip(kdtId, {
      studentLessonNo,
      lessonNo,
      signInType,
      kdtId: targetKdtId,
    });
    return ctx.json(0, 'ok', res);
  }

  async getBatchSignInTip(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      kdtId: targetKdtId,
      signInType,
      lessonNo,
      studentLessonNos,
    } = ctx.getQueryParse();

    const res = await new SignInFacade(ctx).getBatchSignInTip(kdtId, {
      lessonNo,
      studentLessonNos,
      signInType,
      kdtId: targetKdtId,
    });
    return ctx.json(0, 'ok', res);
  }

  async batchCancel(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      studentLessonNos,
      kdtId: targetKdtId,
    } = ctx.request.body;
    const res = await new StudentLessonService(ctx).batchCancel(kdtId, {
      kdtId: targetKdtId,
      studentLessonNos,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  async findLockedPage(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      pageSize,
      page,
      kdtId: targetKdtId,
      assetNos,
      startTime,
      endTime,
    } = ctx.getQueryParse();
    const res = await new StudentLessonService(ctx).findLockedPage(kdtId, {
      pageNumber: page,
      pageSize,
      sort: {
        orders: [{
          property: 'start_time',
          nullHandling: null,
          direction: 'ASC',
        }],
      },
    }, {
      assetNos,
      startTime: Number(startTime),
      endTime: Number(endTime),
      kdtId: targetKdtId,
    });
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
    const { query = {}, pageRequest } = ctx.getQueryParse();

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

  // 创建排课
  async createSchedule(ctx) {
    const { kdtId } = ctx;
    const command = ctx.request.body || {};
    command.operator = this.formatOperator;
    const res = await new ScheduleFacadeService(ctx).createSchedule(kdtId, command);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 获取分校区（分店）列表
   */
  async findPageAllCampus(ctx) {
    const { kdtId } = ctx;
    const { shopCampusQuery, pageRequest } = ctx.getQueryParse() || {};
    if (!shopCampusQuery['hqKdtId']) {
      shopCampusQuery['hqKdtId'] = kdtId;
    }
    const resp = await new ShopQueryService(ctx).findPageAllCampus(shopCampusQuery, pageRequest);
    return ctx.json(0, 'ok', resp);
  }

  /// 轮询新建/编辑排课的结果
  async getActionResult(ctx) {
    const { kdtId } = ctx;
    const { taskNo, kdtId: targetKdtId } = ctx.query || {};

    const queryData = {
      taskNo,
      kdtId: targetKdtId,
    };
    const res = await new PcBatchActionPollingService(ctx).getActionResultV2(kdtId, queryData);

    return ctx.json(0, 'ok', res);
  }

  async getCourseList(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new EduCourseService(ctx).findPageByCondition(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', result);
  }

  // 获取可预约的课节列表
  async getLessons(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {} } = ctx.getQueryParse();

    const result = await new LessonService(ctx).findAppointmentList(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  // 获取日程日期
  async getDays(ctx) {
    const kdtId = ctx.kdtId;
    const { query = {} } = ctx.getQueryParse();

    const result = await new LessonService(ctx).findAppointmentDateList(kdtId, query);
    return ctx.json(0, 'ok', result);
  }
}

module.exports = IndexController;
