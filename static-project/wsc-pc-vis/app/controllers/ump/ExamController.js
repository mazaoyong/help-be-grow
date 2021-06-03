const BaseController = require('../base/BaseController');
const ExamService = require('../../services/paidcontent/ExamService');
const ExamResultService = require('../../services/paidcontent/ExamResultService');
const ExamTitleFacade = require('../../services/paidcontent/ExamTitleService');
const ExamShareService = require('../../services/paidcontent/ExamShareService');
const ExamParticipationPCFacade = require('../../services/owl/pc/ump/ExamParticipationPCFacade');
const CustomerQueryFacade = require('../../services/owl/pc/customer/CustomerQueryFacade');
const ExamPCFacade = require('../../services/owl/pc/ump/ExamPcFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

class ExamController extends BaseController {
  async getIndexHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));
    await ctx.render('ump/exam/index.html');
  }

  // 查询小测试列表
  async getListExamByQueryJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    const res = await new ExamService(ctx).listExamByQuery(
      {
        kdtId,
        examState: req.examState,
        title: req.title || '',
      },
      {
        pageNumber: req.page,
        pageSize: req.size,
      },
    );

    ctx.json(0, 'ok', res);
  }

  // 查询基础信息
  async getBasisJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const res = await new ExamService(ctx).getExamDetail(req);

    ctx.json(0, 'ok', res);
  }

  // 更新保存基础信息
  async postSaveBasisJson(ctx) {
    const kdtId = ctx.kdtId;
    let req = ctx.request.body || {};
    req.kdtId = kdtId;
    req = await ctx.visXss(req, 'summary');
    const res = await new ExamService(ctx).saveExam(req);

    // const res = 123;

    ctx.json(0, 'ok', res);
  }

  // 查询问题列表
  async getTitleListsJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const res = await new ExamTitleFacade(ctx).getQuestionList(req);

    // const res = {
    //   questionCount: 0,
    //   questionList: [],
    // };

    ctx.json(0, 'ok', res);
  }

  // 保存问题列表
  async postSaveTitleJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new ExamTitleFacade(ctx).saveQuestionList(req);

    // const res = true;

    ctx.json(0, 'ok', res);
  }

  // 更新问题列表
  async postUpdateQuestionListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new ExamTitleFacade(ctx).updateQuestionList(req);

    ctx.json(0, 'ok', res);
  }

  // 获取结果信息
  async getResultListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const res = await new ExamResultService(ctx).getResultList(req);

    // const res = {
    //   resultList: [],
    //   questionCount: 30,
    // };

    ctx.json(0, 'ok', res);
  }

  // 保存结果
  async postSaveResultJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new ExamResultService(ctx).saveResultList(req);

    // const res = true;

    ctx.json(0, 'ok', res);
  }

  // 更新结果
  async postUpdateResultListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new ExamResultService(ctx).updateResultList(req);

    // const res = true;

    ctx.json(0, 'ok', res);
  }

  // 获取完成页信息
  async getFinishJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const res = await new ExamShareService(ctx).getShare(req);

    // const res = {};

    ctx.json(0, 'ok', res);
  }

  // 保存完成页信息
  async postSaveFinishJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new ExamService(ctx).activateExam(
      {
        id: req.examId,
        kdtId,
      },
      req,
    );

    // const res = true;

    ctx.json(0, 'ok', res);
  }

  // 失效活动
  async postFailureActivityJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new ExamService(ctx).disabledExam(req);

    ctx.json(0, 'ok', res);
  }

  // 删除活动
  async postDeleteActivityJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new ExamService(ctx).delete(req);

    ctx.json(0, 'ok', res);
  }

  async getExamMpQrCodeJson(ctx) {
    const kdtId = ctx.kdtId;
    const examId = ctx.query.examId || 0;

    const res = await new ExamService(ctx).getExamMpQrCode(kdtId, examId);

    ctx.json(0, 'ok', res);
  }
  async copy(ctx) {
    const command = ctx.request.body || {};
    command.kdtId = ctx.kdtId;
    const res = await new ExamService(ctx).copy(command);
    return ctx.json(0, 'ok', res);
  }

  // 分页查询客户信息
  async getCustomerList(ctx) {
    const kdtId = ctx.kdtId;
    const {
      pageRequest = {
        pageNumber: 1,
        pageSize: 20,
      },
      query,
    } = ctx.getQueryParse();

    const res = await new CustomerQueryFacade(ctx).findPage(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }

  // 分页查询测验参与用户列表
  async findPage(ctx) {
    const kdtId = ctx.kdtId;
    const {
      pageRequest = {
        pageNumber: 1,
        pageSize: 20,
      },
      examId = 0,
      userIdList,
    } = ctx.getQueryParse();

    const query = {
      kdtId,
      examId,
      userIdList: userIdList || null,
    };

    const res = await new ExamParticipationPCFacade(ctx).findPage(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }

  // 查询用户测验的成绩单
  async getTranscript(ctx) {
    const kdtId = ctx.kdtId;
    const { examRecordId } = ctx.request.query;

    const query = {
      kdtId,
      examRecordId,
    };

    const res = await new ExamParticipationPCFacade(ctx).getTranscript(kdtId, query);
    ctx.json(0, 'ok', res);
  }

  // 查询用户测验的答题详情
  async getUserAnswerDetail(ctx) {
    const kdtId = ctx.kdtId;
    const {
      pageRequest = {
        current: 1,
        pageSize: 20,
      },
      examRecordId,
    } = ctx.getQueryParse();

    const query = {
      kdtId,
      examRecordId,
    };

    const res = await new ExamParticipationPCFacade(ctx).getUserAnswerDetail(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }

  // 查询测验是否有用户参与
  async examExistUser(ctx) {
    const kdtId = ctx.kdtId;
    const { examId } = ctx.getQueryParse();

    const query = {
      kdtId,
      examId,
    };

    const res = await new ExamPCFacade(ctx).examExistUser(kdtId, query);
    ctx.json(0, 'ok', res);
  }
}

module.exports = ExamController;
