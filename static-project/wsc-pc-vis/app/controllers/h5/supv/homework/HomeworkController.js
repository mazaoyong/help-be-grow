const BaseController = require('../../../base/BaseController');
const HomeworkFacade = require('../../../../services/api/owl/pc/HomeworkFacade');
const ReviewerFacade = require('../../../../services/api/owl/pc/ReviewerFacade');

class HomeworkController extends BaseController {
  async init() {
    super.init();
  }

  async getHomeworkDetail(ctx) {
    const { kdtId } = ctx;
    const { homeworkId } = ctx.query;
    const result = await new ReviewerFacade(ctx).getHomeworkDetail(kdtId, homeworkId);
    ctx.json(0, 'ok', result);
  }

  async getEditHomeworkDetail(ctx) {
    const { kdtId } = ctx;
    const { homeworkId } = ctx.query;
    const result = await new HomeworkFacade(ctx).getHomeworkDetail(kdtId, homeworkId);
    ctx.json(0, 'ok', result);
  }

  async updateHomework(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;
    command.kdtId = kdtId;
    command.operator = this.formatOperator;
    const result = await new HomeworkFacade(ctx).updateHomework(kdtId, command);
    ctx.json(0, 'ok', result);
  }

  async createHomework(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;
    command.operator = this.formatOperator;
    const result = await new HomeworkFacade(ctx).createHomework(kdtId, command);
    ctx.json(0, 'ok', result);
  }

  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { pageRequest = {}, query = {} } = ctx.getQueryParse();
    const result = await new HomeworkFacade(ctx).findPageByCondition(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = HomeworkController;
