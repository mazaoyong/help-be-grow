const BaseController = require('../../base/BaseController');
const SignInService = require('../../../services/owl/pc/signin/SignInService');
const SignInCodeSettingPcService = require('../../../services/owl/pc/signin/SignInCodeSettingPcService');
const lodashPick = require('lodash/pick');

class SignInController extends BaseController {
  init() {
    super.init();
  }

  async getIndexHtml(ctx) {
    await ctx.render('edu-admin/signin/index.html');
  }

  async findSignInRecords(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();

    const { pageNumber, pageSize, ...queryData } = query;

    const pageRequest = { pageNumber, pageSize };

    const data = await new SignInService(ctx).findSignInRecordsV3(kdtId, pageRequest, queryData);
    return ctx.json(0, 'ok', data);
  }
  async createSignInCodeSetting(ctx) {
    const { kdtId, request } = ctx;
    const { body } = request;
    const data = await new SignInCodeSettingPcService(ctx).create(kdtId, body);
    return ctx.json(0, 'ok', data);
  }

  async updateSignInCodeSetting(ctx) {
    const { kdtId, request } = ctx;
    const { body } = request;
    const data = await new SignInCodeSettingPcService(ctx).change(kdtId, body);
    return ctx.json(0, 'ok', data);
  }

  async getSignInCodeSetting(ctx) {
    const { kdtId } = ctx;
    const { scene } = ctx.getQueryParse();
    const data = await new SignInCodeSettingPcService(ctx).get(kdtId, scene);
    return ctx.json(0, 'ok', data);
  }

  /**
   * 移除学员
   *
   * @param {Object} ctx context
   */
  async remove(ctx) {
    const { kdtId } = ctx;
    const studentLessonRemoveCommand = ctx.request.body;

    const res = await new SignInService(ctx).removeStudent(kdtId, studentLessonRemoveCommand);

    ctx.json(0, 'ok', res);
  }

  async modifyStatus(ctx) {
    const { kdtId } = ctx;
    const changeSignInStateQuery = ctx.request.body;

    const res = await new SignInService(ctx).changeSignInState(kdtId, changeSignInStateQuery);

    ctx.json(0, 'ok', res);
  }

  // 签到页面导出报表
  async exportRecord(ctx) {
    const { kdtId } = ctx;
    const query = ctx.request.body.query;
    const signInRecordsQuery = {
      addressId: query.addressId,
      classId: query.classId,
      eduCourseId: query.eduCourseId,
      endTime: query.endTime,
      kdtId: query.kdtId,
      lessonEndTime: query.lessonEndTime,
      lessonName: query.lessonName,
      lessonStartTime: query.lessonStartTime,
      signInStatus: query.signInStatus,
      startTime: query.startTime,
      teacherId: query.teacherId,
      userId: query.userId,
      ...lodashPick(this.formatOperator, ['nickName', 'mobile']),
    };

    const res = await new SignInService(ctx).submitSignInRecordsQueryForExport(
      kdtId,
      {},
      signInRecordsQuery,
    );

    ctx.json(0, 'ok', res);
  }

  // 排课页面导出报表 - 支持按日导出签到记录
  async exportDayOfSignTable(ctx) {
    const { kdtId } = ctx;
    const query = ctx.request.body.query;
    const { operatorName, operatorPhone } = this.operator;
    const signInRecordsQuery = {
      startTime: query.startTime,
      endTime: query.endTime,
      kdtId: query.kdtId,
      appointRule: query.appointRule,
      classNo: query.classNo,
      teacherNo: query.teacherNo,
      eduCourseName: query.eduCourseName,
      lessonName: query.lessonName,
      addressId: query.addressId,
      operatorName: operatorName,
      operatorMobile: operatorPhone,
      ...this.formatOperator,
    };

    const pageRequest = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      sort: query.sort,
    };

    const res = await new SignInService(ctx).exportDayOfSignTable(
      kdtId,
      pageRequest,
      signInRecordsQuery,
    );

    ctx.json(0, 'ok', res);
  }

  async getSignInRecordHistory(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = this.ctx.getQueryParse();

    const res = await new SignInService(ctx).findSignInRecordHistory(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }

  async getSignInListSummary(ctx) {
    const { kdtId } = ctx;
    const signInRecordsQuery = this.ctx.getQueryParse();

    const res = await new SignInService(ctx).findSignInRecordBriefInfo(kdtId, {
      ...signInRecordsQuery,
      ...this.formatOperator,
    });
    ctx.json(0, 'ok', res);
  }
}

module.exports = SignInController;
