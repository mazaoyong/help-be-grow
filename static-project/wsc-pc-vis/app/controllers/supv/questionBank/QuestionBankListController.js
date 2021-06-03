const BaseController = require('../../base/BaseController');
const QuestionsFacade = require('../../../services/owl/pc/questions/QuestionFacade');

class QuestionBankListController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('supv/question-bank/index.html');
  }

  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { questionQuery, pageRequest } = ctx.getQueryParse();

    const res = await new QuestionsFacade(ctx).findPageByCondition(
      kdtId,
      Object.assign({}, { categoryId: 0 }, questionQuery),
      pageRequest,
    );

    ctx.json(0, 'ok', res);
  }

  async deleteQuestion(ctx) {
    const { kdtId } = ctx;
    const { deleteCommand } = ctx.request.body;
    const operator = this.formatOperator;
    const deleteCommandWithOperator = Object.assign({}, deleteCommand, { operator });

    const res = await new QuestionsFacade(ctx).deleteQuestion(kdtId, deleteCommandWithOperator);

    ctx.json(0, 'ok', res);
  }

  async moveQuestion(ctx) {
    const { kdtId } = ctx;
    const { moveCommand } = ctx.request.body;
    const operator = this.formatOperator;
    const moveCommandWithOperator = Object.assign({}, moveCommand, { operator });

    const res = await new QuestionsFacade(ctx).moveQuestion(kdtId, moveCommandWithOperator);

    ctx.json(0, 'ok', res);
  }
}

module.exports = QuestionBankListController;
