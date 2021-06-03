const BaseController = require('../../base/BaseController');
const AppointmentService = require('../../../services/owl/edu/appointment/AppointmentService');
const StoreService = require('../../../services/owl/edu/StoreService');
const BusinessAppointmentService = require('../../../services/owl/pc/appointment/BusinessAppointmentService');
const { set } = require('lodash');

class AppointmentController extends BaseController {
  async getAppointmentListJson(ctx) {
    const { kdtId = '' } = ctx;
    const { filter = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new BusinessAppointmentService(ctx).findStudentLessons(
      kdtId,
      pageRequest,
      filter,
    );
    return ctx.json(0, 'ok', result);
  }

  async exportJson(ctx) {
    const { kdtId = '' } = ctx;
    const query = ctx.request.body || {};

    const result = await new BusinessAppointmentService(ctx).exportAppointment(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async getAppointmentKanbanJson(ctx) {
    const kdtId = ctx.kdtId;
    const { filter = {} } = ctx.getQueryParse();

    const result = await new AppointmentService(ctx).findForAppointmentKanBan(kdtId, {
      ...filter,
      startTime: +filter.startTime,
      endTime: +filter.endTime,
    });
    return ctx.json(0, 'ok', result);
  }

  async createAppointmentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    // 兼容assetNo有时变为Array的情况
    const { assetNo: originalAssetNo } = query;
    if (originalAssetNo) {
      // 试听体验课无assetNo
      const assetNo =
        typeof originalAssetNo === 'string'
          ? originalAssetNo
          : Array.isArray(originalAssetNo) && originalAssetNo[0];
      Object.assign(query, { assetNo });
    }

    const result = await new AppointmentService(ctx).createStudentLesson(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async confirmAppointmentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    const result = await new AppointmentService(ctx).confirmStudentLesson(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async cancelAppointmentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};

    const queryDate = {
      studentLessonNo: query.studentLessonNo,
      kdtId: query.kdtId,
      operatorId: query.operatorId,
    };

    const result = await new BusinessAppointmentService(ctx).cancelV2(kdtId, queryDate);
    return ctx.json(0, 'ok', result);
  }

  async getAppointmentJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.query || {};

    const queryDate = {
      studentLessonNo: query.studentLessonNo,
      kdtId: query.kdtId,
    };

    const result = await new AppointmentService(ctx).getStudentLessonConfirmInfoV2(
      kdtId,
      queryDate,
    );
    return ctx.json(0, 'ok', result);
  }

  async getStoreListJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.query || {};
    query.kdtId = kdtId;

    const res = await new StoreService(ctx).listStoreForB(query);

    return ctx.json(0, 'ok', res);
  }

  // 线索页B端机构查询学生课表
  async findStudentLessonsForClue(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.getQueryParse();

    const res = await new BusinessAppointmentService(ctx).findStudentLessonsForClue(
      kdtId,
      pageRequest,
      query,
    );

    return ctx.json(0, 'ok', res);
  }

  // 学员详情页B端机构查询学生课表
  async findStudentLessonsByIdentity(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.getQueryParse();

    /**
     * @author zhengjian <zhengjian@youzan.com>
     * 2020-08-24 该接口用来查询学员的体验课，但是后端实现有问题，正式课也被查出来了，修复方案需要
     * 多传递一个参数，这里在 node 端写死，后面需要扩展该接口时，这个参数在前端传递即可。
     * courseType - 预约的课程类型 0 体验课 1 正式课
     * @see https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=60412
     */
    set(query, 'courseType', 0);

    const res = await new BusinessAppointmentService(ctx).findStudentLessonsByIdentity(
      kdtId,
      pageRequest,
      query,
    );

    return ctx.json(0, 'ok', res);
  }

  // 新建试听预约
  async createAuditionAppointment(ctx) {
    const { kdtId, userId } = ctx;
    const query = ctx.request.body || {};
    query.appointmentType = 1;
    query.kdtId = kdtId;
    query.operatorId = userId;
    const result = await new BusinessAppointmentService(ctx).createClueAppointment(kdtId, query);

    return ctx.json(0, 'ok', result);
  }

  async findPageStudentLessonByAssetNo(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, studentLessonByAssetQuery } = ctx.getQueryParse();

    const res = await new BusinessAppointmentService(ctx).findPageStudentLessonByAssetNo(
      kdtId,
      pageRequest,
      studentLessonByAssetQuery,
    );

    return ctx.json(0, 'ok', res);
  }

  async batchCancelV2(ctx) {
    const kdtId = ctx.kdtId;
    const { studentLessonNos } = ctx.request.body;

    const studentLessonCancelCommand = studentLessonNos.map(studentLessonNo => ({
      kdtId,
      operatorId: this.operator.operatorId,
      studentLessonNo,
    }));

    const res = await new BusinessAppointmentService(ctx).batchCancelV2(
      kdtId,
      studentLessonCancelCommand,
    );

    return ctx.json(0, 'ok', res);
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

    const res = await new BusinessAppointmentService(ctx).updateStudentLesson(kdtId, queryData);

    return ctx.json(0, 'ok', res);
  }

  async getUpdateAppointmentResult(ctx) {
    const { kdtId = '', query } = ctx;

    const result = await new BusinessAppointmentService(ctx).getUpdateAppointmentResult(
      kdtId,
      query,
    );
    return ctx.json(0, 'ok', result);
  }
}

module.exports = AppointmentController;
