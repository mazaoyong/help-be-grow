const BaseController = require('../../base/BaseController');
const LessonService = require('../../../services/owl/edu/lesson/LessonService');
const StudentLessonService = require('../../../services/owl/pc/lesson/StudentLessonService');
const StudentLessonAPIService = require('../../../services/api/owl/pc/StudentLessonFacade');
const StudentAggregateService = require('../../../services/owl/pc/student/StudentAggregateService');

class ScheduleDetailController extends BaseController {
  async createStudentLesson(ctx) {
    const kdtId = ctx.kdtId;
    const { body } = ctx.request;
    body.kdtId = body.kdtId || kdtId;
    body.operator = this.formatOperator;
    const res = await new StudentLessonService(ctx).createStudentLesson(kdtId, body);
    return ctx.json(0, 'ok', res);
  }

  async findStuLessonByLessonNo(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.getQueryParse();
    const _query = Object.keys(query)
      .map(key => (query[key] ? { [key]: query[key] } : null))
      .filter(item => item)
      .reduce((obj, item) => {
        return Object.assign(obj, item);
      }, {});
    _query.operator = this.formatOperator;
    const res = await new StudentAggregateService(ctx).findStuLessonByLessonNo(
      kdtId,
      pageRequest,
      _query,
    );
    return ctx.json(0, 'ok', res);
  }

  async getKanBanDetail(ctx) {
    const kdtId = ctx.kdtId;
    const { lessonNo, kdtId: targetKdtId } = ctx.getQueryParse();

    const queryDate = {
      lessonNo,
      kdtId: targetKdtId,
    };

    const res = await new LessonService(ctx).getKanBanDetailV2(kdtId, queryDate);
    return ctx.json(0, 'ok', res);
  }

  async getStatisticalInfo(ctx) {
    const kdtId = ctx.kdtId;
    const { lessonNo, kdtId: targetKdtId } = ctx.query;

    const queryData = {
      lessonNo,
      kdtId: targetKdtId,
    };
    const res = await new StudentLessonService(ctx).getStatisticalInfoV2(kdtId, queryData);
    return ctx.json(0, 'ok', res);
  }

  async getExcel(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.getQueryParse();

    const { operatorName, operatorPhone } = this.operator || {};
    query.operatorName = operatorName;
    query.operatorMobile = operatorPhone;

    const res = await new StudentAggregateService(ctx).exportStuLessonListByLessonNo(kdtId, query);
    return ctx.json(0, 'ok', res);
  }

  async batchRemoveStudent(ctx) {
    const kdtId = ctx.kdtId;
    const requestBody = ctx.getPostData();
    const command = {
      kdtId,
      operator: this.formatOperator,
      ...requestBody,
    };

    const res = await new StudentLessonAPIService(ctx).batchCancelV2(kdtId, command);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = ScheduleDetailController;
