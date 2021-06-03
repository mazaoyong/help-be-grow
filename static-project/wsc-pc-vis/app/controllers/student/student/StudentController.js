const BaseController = require('../../base/BaseController');
const AssetFacade = require('../../../services/owl/pc/asset/AssetFacade');
const StudentCourseService = require('../../../services/owl/edu/student/StudentCourseService');
const StudentAggregateFacade = require('../../../services/owl/student/StudentAggregateFacade');
const StudentFacade = require('../../../services/owl/student/StudentFacade');
const StudentServiceV2 = require('../../../services/owl/pc/student/StudentServiceV2');
const PcStudentService = require('../../../services/owl/pc/student/StudentService');
const StudentService = require('../../../services/owl/edu/student/StudentService');
const TeacherService = require('../../../services/owl/edu/course/TeacherService');
const StoreService = require('../../../services/owl/edu/course/StoreService');
const StudentLessonService = require('../../../services/owl/pc/lesson/StudentLessonService');
const BehaviorQueryService = require('../../../services/api/behavior/BehaviorQueryService');
const ChainShopQueryService = require('../../../services/owl/pc/shop/ChainShopQueryService');
const ShopQueryService = require('../../../services/owl/pc/shop/ShopQueryService');
const StudentFamilyAccountFacade = require('../../../services/owl/pc/student/StudentFamilyAccountFacade');
const StudentDetailService = require('../../../services/owl/edu/student/StudentDetailService');
class StudentController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.setChainShopSettings();
      await this.ctx.getAbilitiesByNamespace(this.ctx, {
        namespaceId: 'courseAssert',
        businessId: 'wsc-pc-vis',
      });
    }
  }

  async getIndexHtml(ctx) {
    ctx.setGlobal('operator', this.operator || {});
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await ctx.render('student/student/index.html');
  }

  // 查询校区中的学员
  async getStudentListByKdtId(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();
    Object.keys(query).forEach(key => {
      if (query[key] === '') {
        query[key] = null;
      }
    });

    const res = await new StudentServiceV2(ctx).findPageByQuery(kdtId, pageRequest, query);

    ctx.json(0, 'ok', res);
  }

  // 获取客户学员列表
  async getStudentListJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findPageByQuery(kdtId, pageRequest, query);

    ctx.json(0, 'ok', res);
  }

  // 查询7天内生日的学员
  async getStudentListByBirthdayJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findPageByBirthday(kdtId, pageRequest, query);

    ctx.json(0, 'ok', res);
  }

  // 查询课时即将用尽的学员
  async getStudentListByRemainingHourNotEnoughJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findPageByRemainingHourNotEnough(
      kdtId,
      pageRequest,
      query,
    );

    ctx.json(0, 'ok', res);
  }

  // 查询课时即将到期的学员
  async getStudentListByEndTimeNotEnoughJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findPageByEndTimeNotEnough(
      kdtId,
      pageRequest,
      query,
    );

    ctx.json(0, 'ok', res);
  }

  // 查询7日内未上课的学员
  async getStudentListByUnusedAssetJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findPageByUnusedAsset(
      kdtId,
      pageRequest,
      query,
    );

    ctx.json(0, 'ok', res);
  }

  // 根据学员id获取学员报名的课程信息
  async getCourseListByIdJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findCourseByStudentId(
      kdtId,
      pageRequest,
      query,
    );

    ctx.json(0, 'ok', res);
  }

  // 根据学员id获取学员学习记录
  async getCourseRecordsByIdJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findRecordsByStudentId(
      kdtId,
      pageRequest,
      query,
    );

    ctx.json(0, 'ok', res);
  }

  async getStudyRecordStatistics(ctx) {
    const { kdtId, query = {} } = ctx;

    const res = await new StudentLessonService(ctx).getRecordByStudentIdV2(kdtId, query);
    ctx.json(0, 'ok', res);
  }

  // 根据学员id获取学员课表信息
  async getCourseScheduleJson(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findScheduleByStudentId(
      kdtId,
      pageRequest,
      query,
    );

    ctx.json(0, 'ok', res);
  }

  // 根据学员手机号，分页查询学员的课程信息
  async findPageByMobileWithCourse(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).findPageByMobileWithCourse(
      kdtId,
      pageRequest,
      query,
    );

    ctx.json(0, 'ok', res);
  }

  // 根据学员id获取学员信息
  async getInfoByIdJson(ctx) {
    const { kdtId } = ctx;
    const { studentId } = ctx.query;

    const res = await new StudentFacade(ctx).getInfoById(kdtId, studentId);

    ctx.json(0, 'ok', res);
  }

  // 根据学员id获取学员信息——手机号脱敏
  async getInfoByIdForHideJson(ctx) {
    const { kdtId } = ctx;
    const { studentId } = ctx.query;

    const res = await new StudentFacade(ctx).getDetailByIdForHide(kdtId, studentId);

    ctx.json(0, 'ok', res);
  }

  // 修改课程有效期
  async modifyAvailableTime(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;

    command.operator = this.formatOperator;

    const res = await new AssetFacade(ctx).updateValidity(kdtId, command);

    ctx.json(0, 'ok', res);
  }

  // 新增学员
  async create(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;
    req.kdtId = kdtId;

    const res = await new StudentService(ctx).create(req);

    ctx.json(0, 'ok', res);
  }

  // 学员详情
  async detail(ctx) {
    const { kdtId } = ctx;
    const { customerUserId, alias } = ctx.request.query;

    const res = await new StudentService(ctx).detail(kdtId, customerUserId, alias);

    ctx.json(0, 'ok', res);
  }

  // 编辑学员
  async updateStudent(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;

    const res = await new StudentFacade(ctx).update(kdtId, req);

    ctx.json(0, 'ok', res);
  }

  // 编辑学员
  async update(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;
    req.kdtId = kdtId;

    const res = await new StudentService(ctx).update(req);

    ctx.json(0, 'ok', res);
  }

  // 学员详情
  async delete(ctx) {
    const { kdtId } = ctx;
    const { studentId, userId } = ctx.request.body;

    const res = await new StudentFacade(ctx).delete(kdtId, { studentId, userId });

    ctx.json(0, 'ok', res);
  }

  // 学员课表
  async courseList(ctx) {
    const { kdtId } = ctx;
    const { params = {}, pageable } = ctx.getQueryParse();

    const res = await new StudentCourseService(ctx).findPageByCondition(params, pageable, kdtId);

    ctx.json(0, 'ok', res);
  }

  // 获取学员一月课程
  async findMonthCourse(ctx) {
    const { kdtId } = ctx;
    const { customerUserId, year, month } = ctx.request.query;

    const res = await new StudentCourseService(ctx).findOneMonth(
      kdtId,
      customerUserId,
      year,
      month,
    );

    ctx.json(0, 'ok', res);
  }

  // 获取店铺学员列表
  async getKdtStudentList(ctx) {
    const { kdtId } = ctx;
    const { params = {}, pageable } = ctx.getQueryParse();

    const res = await new StudentService(ctx).getKdtStudentList(params, pageable, kdtId);

    ctx.json(0, 'ok', res);
  }

  // 查询某个店铺下的老师信息，不分页
  async getTeacherList(ctx) {
    const { kdtId } = ctx;
    const { keyword } = ctx.request.query;

    const req = { kdtId };
    if (keyword !== '') {
      req.keyword = keyword;
    }

    const res = await new TeacherService(ctx).getTeacherList(req);

    ctx.json(0, 'ok', res);
  }

  // 根据条件查询网点信息，不分页
  async getStoreList(ctx) {
    const { kdtId } = ctx;
    const { keyword } = ctx.request.query;

    const req = { kdtId };
    if (keyword !== '') {
      req.keyword = keyword;
    }

    const res = await new StoreService(ctx).getStoreList(req);

    ctx.json(0, 'ok', res);
  }

  // 课程交易统计
  async getTradeInfo(ctx) {
    const { kdtId } = ctx;
    const { accountId, accountType } = ctx.query;

    let res;
    const req = { kdtId, orderBiz2ScrmSet: ['10031'] };

    if (accountType === '1') {
      req.yzUid = accountId;
      res = await new BehaviorQueryService(ctx).getSummaryByYzUid(req);
    } else {
      req.fansId = accountId;
      res = await new BehaviorQueryService(ctx).getSummaryByFans(req);
    }
    ctx.json(0, 'ok', res);
  }

  async getSchoolListOfStudent(ctx) {
    const { kdtId: operateKdtId } = ctx;
    const query = ctx.request.query;
    const pageRequest = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    };
    const userRelatedShopQuery = {
      role: query.role || 0,
      userId: query.userId,
    };
    const result = await new ChainShopQueryService(ctx).findPageByUser(
      operateKdtId,
      pageRequest,
      userRelatedShopQuery,
    );
    ctx.json(0, 'success', result);
  }

  async getChainShopList(ctx) {
    const { kdtId } = ctx;
    const result = await new ShopQueryService(ctx).queryAllShop(kdtId);
    return result;
  }
  // 修改学员课时数检查
  async checkCourseTime(ctx) {
    const { kdtId: operateKdtId } = ctx;
    const { assetNo, studentId, updateCourse, updateType, kdtId = operateKdtId, changeType, remark } = ctx.query;
    const command = {
      assetNo,
      studentId,
      updateCourse: +updateCourse,
      updateType: +updateType,
      kdtId,
      changeType: +changeType,
      remark,
      operator: this.formatOperator,
    };
    const res = await new AssetFacade(ctx).checkCourseTime(operateKdtId, command);
    ctx.json(0, 'ok', res);
  }

  // 修改学员课时数
  async updateCourseTime(ctx) {
    const { kdtId: operateKdtId } = ctx;
    const { assetNo, studentId, updateCourse, updateType, kdtId = operateKdtId, changeType, remark } = ctx.request.body;
    const command = {
      assetNo,
      studentId,
      updateCourse: +updateCourse,
      updateType: +updateType,
      kdtId,
      changeType: +changeType,
      remark,
      operator: this.formatOperator,
    };
    const res = await new AssetFacade(ctx).updateCourseTime(operateKdtId, command);
    ctx.json(0, 'ok', res);
  }

  // 根据学员手机号，分页查询学员的课程信息
  async findPageByQueryWithWrapCourse(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.getQueryParse();
    const res = await new StudentAggregateFacade(ctx).findPageByQueryWithWrapCourse(
      kdtId,
      pageRequest,
      query,
    );
    return ctx.json(0, 'ok', res);
  }

  // 查询冻结课程明细
  async findLockedPage(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.getQueryParse();
    const res = await new StudentLessonService(ctx).findLockedPage(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', res);
  }

  // 查询签到提示内上课列表
  async findLittlePage(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.getQueryParse();
    query.endTime = parseInt(query.endTime);
    const res = await new StudentLessonService(ctx).findLittlePage(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', res);
  }

  // 批量移除冻结课时
  async batchCancel(ctx) {
    const kdtId = ctx.kdtId;
    const { command = {} } = ctx.request.body;
    command.operator = this.formatOperator;
    const res = await new StudentLessonService(ctx).batchCancel(kdtId, command);
    return ctx.json(0, 'ok', res);
  }

  // 根据学员id查询学员的家庭联系人
  async getByStudentId(ctx) {
    const { kdtId } = ctx;
    const { studentId } = ctx.getQueryParse();
    const res = await new StudentFamilyAccountFacade(ctx).getByStudentId(kdtId, studentId);
    return ctx.json(0, 'ok', res);
  }

  // 使用学员id删除
  async deleteV2(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;
    const res = await new StudentServiceV2(ctx).delete(kdtId, req);
    ctx.json(0, 'ok', res);
  }

  // 获取客户学员列表
  async findPageByQueryV2(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest } = ctx.getQueryParse();
    const res = await new StudentAggregateFacade(ctx).findPageByQueryV2(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }

  // 修改学员/线索来源
  async modifySource(ctx) {
    const { kdtId } = ctx;
    const query = ctx.request.body;
    const params = {
      newSourceId: query.newSourceId || 0, // 来源ID
      clueId: query.clueId || null, // 可选参数
      identityNo: query.identityNo || '', // 通过学员详情或者线索详情接口获取到
    };
    params.operator = this.formatOperator;
    const res = await new StudentDetailService(ctx).modifySource(kdtId, params);
    ctx.json(0, 'ok', res);
  }

  // 根据no获取学员信息
  async getByNo(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const studentId = query.studentId;
    const identityNo = query.identityNo;
    const clueId = Number(query.clueId);

    const res = await new StudentDetailService(ctx).getByNo(kdtId, { identityNo, studentId, clueId });
    ctx.json(0, 'ok', res);
  }

  async saveAttribute(ctx) {
    const { kdtId } = ctx;
    const query = ctx.request.body;

    const res = await new StudentDetailService(ctx).saveAttribute(kdtId, query);
    ctx.json(0, 'ok', res);
  }

  async checkIsPotential(ctx) {
    const { kdtId } = ctx;
    const { studentId } = ctx.getQueryParse();

    const res = await new StudentDetailService(ctx).checkIsPotential(kdtId, studentId);
    ctx.json(0, 'ok', res);
  }

  async getStudentListPageStatistics(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();

    const res = await new StudentAggregateFacade(ctx).getStudentListPageStatistics(kdtId, query);
    ctx.json(0, 'ok', res);
  }

  async findSignUpReadInfo(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const {
      pageNum,
      pageSize,
      targetKdtId
    } = query;
    const pageRequest = {
      pageNumber: Number(pageNum),
      pageSize: pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'created_at',
            nullHandling: null,
          },
        ],
      },
    };
    query.kdtIds = targetKdtId ? [ targetKdtId ] : [];
    let res = await new PcStudentService(ctx).findSignUpReadInfo(kdtId, query, pageRequest);
    ctx.json(0, 'ok', res);
  }
}

module.exports = StudentController;
