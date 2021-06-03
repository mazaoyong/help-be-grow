/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const ClueQueryFacade = require('../../../services/owl/pc/clue/ClueQueryFacade');
const AppointmentService = require('../../../services/owl/edu/appointment/AppointmentService');
const StudentAggregateService = require('../../../services/owl/pc/student/StudentAggregateService');
const ClueRecordService = require('../../../services/owl/pc/clue/ClueRecordService');
const ClueOperateService = require('../../../services/owl/pc/clue/ClueOperateService');
const EnrollService = require('../../../services/owl/pc/enrollform/EnrollService');
const BusinessAppointmentService = require('../../../services/owl/pc/appointment/BusinessAppointmentService');
const ClueOperateFacade = require('../../../services/owl/pc/clue/ClueOperateFacade');
const RelatedOrderFacade = require('../../../services/owl/pc/clue/RelatedOrderFacade');
const ClueSettingPcService = require('../../../services/owl/pc/clue/enrollsetting/ClueSettingPcService');

class IndexController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('h5/clue-detail.html');
  }

  async getDetailById(ctx) {
    // 获取线索详情
    const { kdtId } = ctx;
    const { clueId } = ctx.query;
    const res = await new ClueQueryFacade(ctx).getDetailById(kdtId, clueId);

    return ctx.json(0, 'ok', res);
  }

  // 查询线索关联订单
  async queryRelatedOrder(ctx) {
    const { kdtId } = ctx;
    const {
      params: { page, query },
    } = ctx.getQueryParse();
    const res = await new RelatedOrderFacade(ctx).query(kdtId, page, query);

    ctx.json(0, 'ok', res);
  }

  async findStudentLessons(ctx) {
    // 按学员获取体验课列表
    const { kdtId } = ctx;
    const { pageNumber, pageSize, courseType, phoneNo } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const studentLessonQuery = {
      courseType,
      phoneNo,
    };
    const res = await new AppointmentService(ctx).findStudentLessons(
      kdtId,
      pageRequest,
      studentLessonQuery,
    );

    return ctx.json(0, 'ok', res);
  }

  async findStudentLessonsForClue(ctx) {
    // 按学员获取体验课列表
    const { kdtId } = ctx;
    const { pageNumber, pageSize, mobile, name } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const studentLessonQuery = {
      mobile,
      name,
    };
    const res = await new BusinessAppointmentService(ctx).findStudentLessonsForClue(
      kdtId,
      pageRequest,
      studentLessonQuery,
    );

    return ctx.json(0, 'ok', res);
  }

  // 按学员获取体验课列表-新
  async findStudentLessonsByIdentity(ctx) {
    const { kdtId } = ctx;
    const { pageNumber, pageSize, mobile, name, studentId } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };

    /**
     * @author zhengjian <zhengjian@youzan.com>
     * 2020-08-24 该接口用来查询学员的体验课，但是后端实现有问题，正式课也被查出来了，修复方案需要
     * 多传递一个参数，这里在 node 端写死，后面需要扩展该接口时，这个参数在前端传递即可。
     * courseType - 预约的课程类型 0 体验课 1 正式课
     * @see https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=60412
     */
    const studentLessonQuery = {
      mobile,
      name,
      studentId,
      courseType: 0,
    };

    const res = await new BusinessAppointmentService(ctx).findStudentLessonsByIdentity(
      kdtId,
      pageRequest,
      studentLessonQuery,
    );

    return ctx.json(0, 'ok', res);
  }

  async findPageByMobileWithCourse(ctx) {
    // 获取已购课程
    const { kdtId } = ctx;
    const { pageNumber, pageSize, mobile } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const query = {
      mobile,
    };
    const res = await new StudentAggregateService(ctx).findPageByMobileWithCourse(
      kdtId,
      pageRequest,
      query,
    );

    return ctx.json(0, 'ok', res);
  }

  async findPageClueRecords(ctx) {
    // 获取动态记录
    const { kdtId } = ctx;
    const { pageNumber, pageSize, clueId, recordType } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'updated_at',
          },
        ],
      },
    };
    const recordQuery = {
      clueId,
      recordType,
    };
    const res = await new ClueRecordService(ctx).findPageClueRecords(
      kdtId,
      recordQuery,
      pageRequest,
    );

    return ctx.json(0, 'ok', res);
  }

  async getNextDetailById(ctx) {
    // 获取下一条线索
    const { kdtId } = ctx;
    const { clueId } = ctx.query;
    const res = await new ClueQueryFacade(ctx).getNextDetailById(kdtId, clueId);

    return ctx.json(0, 'ok', res);
  }

  async cancelAppointment(ctx) {
    // 取消预约
    const { kdtId } = ctx;
    const { studentLessonNo, kdtId: targetKdtId } = ctx.request.body;
    const operatorId = ctx.getLocalSession('userInfo').id;

    const command = {
      studentLessonNo: studentLessonNo,
      kdtId: targetKdtId || kdtId,
      operator: this.formatOperator,
      operatorId,
    };

    const res = await new BusinessAppointmentService(ctx).cancelV2(kdtId, command);

    return ctx.json(0, 'ok', res);
  }

  async changeState(ctx) {
    // 更新线索状态
    const { kdtId } = ctx;
    const { clueId, targetStateCode, relatedOrderNo } = ctx.request.body;
    const userId = ctx.getLocalSession('userInfo').id;
    const mobile = ctx.getLocalSession('userInfo').mobile;
    const source = 'wsc-pc-vis';
    const command = {
      clueId,
      operator: {
        userId,
        mobile,
        source,
      },
      targetStateCode,
      relatedOrderNo,
    };
    const res = await new ClueOperateService(ctx).changeState(kdtId, command);

    return ctx.json(0, 'ok', res);
  }

  async createPreAppointment(ctx) {
    // 办理试听前需要调的一次接口
    const { kdtId } = ctx;
    const { dataItemInfo, name, telephone, userId } = ctx.request.body;
    const apptCommand = {
      dataItemInfo,
      name,
      telephone,
    };
    if (userId) {
      apptCommand.userId = userId;
    }
    const res = await new EnrollService(ctx).createPreAppointment(kdtId, apptCommand);

    return ctx.json(0, 'ok', res);
  }

  async createPreAppointmentForClue(ctx) {
    // 办理试听前需要调的一次接口
    const { kdtId } = ctx;
    const { clueId, dataItemInfo, name, telephone, userId } = ctx.request.body;
    const apptCommand = {
      clueId,
      dataItemInfo,
      name,
      telephone,
    };
    if (userId) {
      apptCommand.userId = userId;
    }
    const res = await new EnrollService(ctx).createPreAppointmentForClue(kdtId, apptCommand);

    return ctx.json(0, 'ok', res);
  }

  // 分配线索(批量)
  async distributeClues(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).distributeClues(kdtId, { ...req, operator });

    ctx.json(0, 'ok', res);
  }

  async createClueRecord(ctx) {
    // 创建跟进记录
    const { kdtId } = ctx;
    const { clueId, imageList, recordText, revisitTime } = ctx.request.body;
    const userId = ctx.getLocalSession('userInfo').id;
    const mobile = ctx.getLocalSession('userInfo').mobile;
    const source = 'wsc-pc-vis';
    const recordCommand = {
      clueId,
      imageList,
      recordText,
      operator: {
        userId,
        mobile,
        source,
      },
    };
    if (revisitTime) {
      recordCommand.revisitTime = Number(revisitTime);
    }
    const res = await new ClueRecordService(ctx).createClueRecord(kdtId, recordCommand);

    return ctx.json(0, 'ok', res);
  }

  async updateClueRecord(ctx) {
    // 更新跟进记录
    const { kdtId } = ctx;
    const { clueId, recordId, imageList, recordText, revisitTime } = ctx.request.body;
    const userId = ctx.getLocalSession('userInfo').id;
    const mobile = ctx.getLocalSession('userInfo').mobile;
    const source = 'wsc-pc-vis';
    const recordCommand = {
      clueId,
      recordId,
      imageList,
      recordText,
      operator: {
        userId,
        mobile,
        source,
      },
    };
    if (revisitTime) {
      recordCommand.revisitTime = Number(revisitTime);
    }
    const res = await new ClueRecordService(ctx).updateClueRecord(kdtId, recordCommand);

    return ctx.json(0, 'ok', res);
  }

  // 获取线索设置
  async getClueSetting(ctx) {
    const { kdtId } = ctx;
    const data = await new ClueSettingPcService(ctx).getClueSetting(kdtId);
    ctx.json(0, 'ok', data);
  }
}

module.exports = IndexController;
