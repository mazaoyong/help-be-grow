const BaseController = require('../base/BaseController');
const StudentService = require('../../../services/owl/pc/student/StudentService');
const EduCourseService = require('../../../services/owl/edu/educourse/EduCourseService');
const LessonService = require('../../../services/owl/pc/lesson/LessonService');
const AppointmentService = require('../../../services/owl/edu/appointment/AppointmentService');
const BusinessAppointmentService = require('../../../services/owl/pc/appointment/BusinessAppointmentService');

class BookListenController extends BaseController {
  // 办理试听页面
  async getIndexHtml(ctx) {
    await ctx.render('h5/book-listen.html');
  }

  // 获取学员列表
  async getStudentsJson(ctx) {
    const { kdtId = '' } = ctx;
    const { filter = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new StudentService(ctx).findPageByQueryWithCustomer(
      kdtId,
      pageRequest,
      filter,
    );
    return ctx.json(0, 'ok', result);
  }

  // 获取课程列表
  async getCourseListJson(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new EduCourseService(ctx).findPageByCondition(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', result);
  }

  // 获取日程日期
  async getDaysJson(ctx) {
    const kdtId = ctx.kdtId;
    const { query = {} } = ctx.getQueryParse();

    const result = await new LessonService(ctx).findAppointmentDateList(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  // 获取可预约的课节列表
  async getLessonsJson(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {} } = ctx.getQueryParse();

    const result = await new LessonService(ctx).findAppointmentList(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  // 新建试听预约
  async createAppointmentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};
    const queryData = {
      ...query,
      operatorId: ctx.userId,
      operator: this.formatOperator,
    };

    const result = await new AppointmentService(ctx).createStudentLesson(kdtId, queryData);
    return ctx.json(0, 'ok', result);
  }

  // 新建自由时间试听预约
  async createClueAppointmentJson(ctx) {
    const { kdtId, userId } = ctx;
    const query = ctx.request.body || {};
    query.appointmentType = 1;
    query.kdtId = kdtId;
    query.operatorId = userId;
    const result = await new BusinessAppointmentService(ctx).createClueAppointment(kdtId, query);

    return ctx.json(0, 'ok', result);
  }

  // 确认试听预约
  async confirmAppointmentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    const result = await new AppointmentService(ctx).confirmStudentLesson(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  // 查询预约信息，用于确认预约
  async getAppointmentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.query || {};

    const result = await new AppointmentService(ctx).getStudentLessonConfirmInfo(
      kdtId,
      query.studentLessonNo,
    );
    return ctx.json(0, 'ok', result);
  }

  async getStudentLessonForUpdate(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.query || {};

    const queryDate = {
      ...query,
      operator: this.formatOperator,
    };

    const result = await new BusinessAppointmentService(ctx).getStudentLessonForUpdate(
      kdtId,
      queryDate,
    );
    return ctx.json(0, 'ok', result);
  }

  async updateStudentLesson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body;

    const queryData = {
      ...query,
      operatorId: ctx.userId,
      operator: this.formatOperator,
    };

    const res = await new BusinessAppointmentService(ctx).updateStudentLesson(
      kdtId,
      queryData,
    );

    return ctx.json(0, 'ok', res);
  }
}

module.exports = BookListenController;
