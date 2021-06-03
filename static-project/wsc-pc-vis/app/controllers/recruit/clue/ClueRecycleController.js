const ClueBaseController = require('./ClueBaseController');
const ClueQueryFacade = require('../../../services/owl/pc/clue/ClueQueryFacade');
class ClueRecycleController extends ClueBaseController {
  async getIndexHTML(ctx) {
    await this.initPluginStatus();
    ctx.setGlobal('operator', this.operator || {});
    await ctx.render('recruit/clue/cluerecycle.html');
  }

  async findClueInRecycleBinByPage(ctx) {
    const { kdtId } = ctx;
    const { request, recycleBinQuery = {} } = ctx.getQueryParse();

    const result = await new ClueQueryFacade(ctx).findClueInRecycleBinByPage(
      kdtId,
      request,
      recycleBinQuery,
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = ClueRecycleController;
