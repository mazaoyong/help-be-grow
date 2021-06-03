const BaseController = require('../../base/BaseController');
const QuestionsCategoryFacade = require('../../../services/owl/pc/questions/QuestionCategoryFacade');

class QuestionBankClassifyController extends BaseController {
  async findCategoryByCondition(ctx) {
    const { kdtId } = ctx;
    const { categoryQuery, pageRequest } = ctx.getQueryParse();

    const res = await new QuestionsCategoryFacade(ctx).findPageByCondition(
      kdtId,
      categoryQuery,
      pageRequest,
    );

    ctx.json(0, 'ok', res);
  }

  async createCategory(ctx) {
    const { kdtId } = ctx;
    const { createCommand } = ctx.request.body;
    const createCommandWithOperator = Object.assign({}, createCommand, {
      operator: this.formatOperator,
    });

    const res = await new QuestionsCategoryFacade(ctx).createCategory(
      kdtId,
      createCommandWithOperator,
    );

    ctx.json(0, 'ok', res);
  }

  async updateCategory(ctx) {
    const { kdtId } = ctx;
    const { updateCommand } = ctx.request.body;
    const updateCommandWithOperator = Object.assign({}, updateCommand, {
      operator: this.formatOperator,
    });

    const res = await new QuestionsCategoryFacade(ctx).updateCategory(
      kdtId,
      updateCommandWithOperator,
    );

    ctx.json(0, 'ok', res);
  }

  async deleteCategory(ctx) {
    const { kdtId } = ctx;
    const { deleteCommand } = ctx.request.body;
    const deleteCommandWithOperator = Object.assign({}, deleteCommand, {
      operator: this.formatOperator,
    });

    const res = await new QuestionsCategoryFacade(ctx).deleteCategory(
      kdtId,
      deleteCommandWithOperator,
    );

    ctx.json(0, 'ok', res);
  }

  async moveCategory(ctx) {
    const { kdtId } = ctx;
    const { moveCommand } = ctx.request.body;
    const moveCommandWithOperator = Object.assign({}, moveCommand, {
      operator: this.formatOperator,
    });

    const res = await new QuestionsCategoryFacade(ctx).moveCategory(
      kdtId,
      moveCommandWithOperator,
    );

    ctx.json(0, 'ok', res);
  }
}

module.exports = QuestionBankClassifyController;
