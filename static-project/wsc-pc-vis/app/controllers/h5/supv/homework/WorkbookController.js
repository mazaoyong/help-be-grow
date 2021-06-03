const BaseController = require('../../../base/BaseController');
const ExerciseBookFacade = require('../../../../services/api/owl/pc/ExerciseBookFacade');

class WorkbookController extends BaseController {
  async init() {
    super.init();
  }

  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query = {} } = ctx.getQueryParse();
    query.userId = (this.formatOperator || {}).userId || 0;
    const result = await new ExerciseBookFacade(ctx).findPageByUserId(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  // 获取作业本详情
  async getExerciseBookDetail(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.getQueryParse() || {};
    const result = await new ExerciseBookFacade(ctx).getExerciseBookDetail(kdtId, id);
    ctx.json(0, 'ok', result);
  }
}

module.exports = WorkbookController;
