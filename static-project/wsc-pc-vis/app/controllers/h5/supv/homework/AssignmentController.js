const BaseController = require('../../../base/BaseController');
const ReviewerFacade = require('../../../../services/api/owl/pc/ReviewerFacade');
const AssignmentFacade = require('../../../../services/api/owl/pc/AssignmentFacade');

class AssignmentController extends BaseController {
  async init() {
    super.init();
  }

  async getAssignment(ctx) {
    const { kdtId } = ctx;
    const { assignmentId } = ctx.query;
    const result = await new ReviewerFacade(ctx).getAssignment(kdtId, assignmentId);
    ctx.json(0, 'ok', result);
  }

  async review(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;
    const { userId: reviewerId } = this.formatOperator;
    command.reviewerId = reviewerId;
    console.log('评论：', command);
    const result = await new ReviewerFacade(ctx).review(kdtId, command);
    ctx.json(0, 'ok', result);
  }

  async assignmentSort(ctx) {
    const { kdtId } = ctx;
    const { query = {} } = ctx.getQueryParse();
    const result = await new ReviewerFacade(ctx).assignmentSort(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async findHomeworkAssignmentPage(ctx) {
    const { kdtId } = ctx;
    const { pageRequest = {}, query = {} } = ctx.getQueryParse();
    const result = await new AssignmentFacade(ctx).findHomeworkAssignmentPage(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  async findLatestComment(ctx) {
    const { kdtId } = ctx;
    const { userId } = this.formatOperator;
    const result = await new ReviewerFacade(ctx).findLatestComment(
      kdtId,
      { pageSize: 1, pageNumber: 1 },
      { userId },
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = AssignmentController;
