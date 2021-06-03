const ExamBaseController = require('./ExamBaseController');
const ExamService = require('../../../services/exam/ExamService');

class ExamController extends ExamBaseController {
  // 提交答题答案
  async submitAnswerJson(ctx) {
    const {
      examId,
      itemIdList,
      questionIdList,
      identity = '',
    } = ctx.getPostData();
    const {
      fans_id: fansId = 0,
      fans_type: fansType = 0,
    } = ctx.getLocalSession();
    const params = {
      examId,
      itemIdList,
      questionIdList,
      identity,
      fansId,
      fansType,
      kdtId: ctx.kdtId,
      userId: ctx.buyerId,
    };

    const result = await new ExamService(ctx).submitAnswer(params);
    ctx.json(0, 'ok', result);
  }

  // 提交用户参与测试的信息
  async joinExamJson(ctx) {
    const {
      examId,
      identity = '',
    } = ctx.getPostData();
    const {
      fans_id: fansId = 0,
      fans_type: fansType = 0,
    } = ctx.getLocalSession();
    const params = {
      examId,
      identity,
      fansId,
      fansType,
      kdtId: ctx.kdtId,
      userId: ctx.buyerId,
    };

    const result = await new ExamService(ctx).joinExam(params);
    ctx.json(0, 'ok', result);
  }

  // 获取测试详情
  async getExamDetailJson(ctx) {
    const {
      id,
      identity = '',
    } = ctx.getQueryData();
    const params = {
      id,
      identity,
      kdtId: ctx.kdtId,
      userId: ctx.buyerId,
    };

    const result = await new ExamService(ctx).getExamDetail(params);
    ctx.json(0, 'ok', result);
  }

  // 获取问题列表
  async getQuestionListJson(ctx) {
    const {
      examId,
      identity = '',
    } = ctx.getQueryData();
    const params = {
      examId,
      identity,
      kdtId: ctx.kdtId,
    };

    const result = await new ExamService(ctx).getQuestionList(params);
    ctx.json(0, 'ok', result);
  }

  // 获取测试记录
  async getExamRecordJson(ctx) {
    const {
      examId,
      identity = '',
    } = ctx.getQueryData();
    const {
      fans_id: fansId = 0,
      fans_type: fansType = 0,
    } = ctx.getLocalSession();
    const params = {
      examId,
      identity,
      fansId,
      fansType,
      kdtId: ctx.kdtId,
      userId: ctx.buyerId,
    };

    const result = await new ExamService(ctx).getExamRecord(params);
    ctx.json(0, 'ok', result);
  }

  // 获取分享信息
  async getShareJson(ctx) {
    const {
      examId,
      identity = '',
      sourceType,
    } = ctx.getQueryData();
    const params = {
      examId,
      identity,
      sourceType,
      kdtId: ctx.kdtId,
      userId: ctx.buyerId,
    };

    const result = await new ExamService(ctx).getShare(params);
    ctx.json(0, 'ok', result);
  }
}

module.exports = ExamController;
