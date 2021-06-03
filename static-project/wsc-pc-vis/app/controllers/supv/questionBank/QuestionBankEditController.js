const BaseController = require('../../base/BaseController');
const QuestionsFacade = require('../../../services/owl/pc/questions/QuestionFacade');

class QuestionBankEditController extends BaseController {
  async getQuestionDetail(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.getQueryParse();

    const res = await new QuestionsFacade(ctx).getQuestionDetail(kdtId, id);

    ctx.json(0, 'ok', res);
  }

  async createQuestion(ctx) {
    const { kdtId } = ctx;
    const { createCommand } = ctx.request.body;
    const operator = this.formatOperator;
    const createCommandWithOperator = Object.assign({}, createCommand, { operator });

    const res = await new QuestionsFacade(ctx).createQuestion(kdtId, createCommandWithOperator);

    ctx.json(0, 'ok', res);
  }

  async updateQuestion(ctx) {
    const { kdtId } = ctx;
    const { updateCommand } = ctx.request.body;
    const operator = this.formatOperator;
    const updateCommandWithOperator = Object.assign({}, updateCommand, { operator });

    const res = await new QuestionsFacade(ctx).updateQuestion(kdtId, updateCommandWithOperator);

    ctx.json(0, 'ok', res);
  }
}

module.exports = QuestionBankEditController;
