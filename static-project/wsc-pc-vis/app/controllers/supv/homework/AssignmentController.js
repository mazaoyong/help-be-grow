const BaseController = require('../../base/BaseController');
const AssignmentFacade = require('../../../services/api/owl/pc/AssignmentFacade');
const ReviewerFacade = require('../../../services/api/owl/pc/ReviewerFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

class AssignmentController extends BaseController {
  async init(ctx) {
    super.init();
  }

  async getIndexHtml(ctx) {
    await this.initVisPage(ctx).catch(e => console.error(e));
    await this.initBdappInfo(ctx).catch(e => console.error(e));

    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await ctx.render('supv/homework/assignment.html');
  }

  // 获取作业中学生作业列表（学生维度）
  async findExerciseAssignmentPage(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const result = await new AssignmentFacade(ctx).findExerciseAssignmentPage(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  // 获取作业本中学生作业列表（作业维度）
  async findHomeworkAssignmentPage(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const result = await new AssignmentFacade(ctx).findHomeworkAssignmentPage(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  // 获取学员作业详情
  async getAssignment(ctx) {
    const { kdtId } = ctx;
    const { id: assignmentId } = ctx.getQueryParse() || {};
    const result = await new ReviewerFacade(ctx).getAssignment(kdtId, assignmentId);
    ctx.json(0, 'ok', result);
  }

  // 提交批阅
  async review(ctx) {
    const { kdtId } = ctx;
    const command = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const reviewerId = operator.userId;
    const result = await new ReviewerFacade(ctx).review(kdtId, { ...command, reviewerId });
    ctx.json(0, 'ok', result);
  }

  // 批阅作业本时获取当前作业上一个、下一个信息
  async assignmentSort(ctx) {
    const { kdtId } = ctx;
    const query = ctx.request.body || {};
    const result = await new ReviewerFacade(ctx).assignmentSort(kdtId, query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = AssignmentController;
