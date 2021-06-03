const ClueBaseController = require('./ClueBaseController');
const CluePluginService = require('../../../services/owl/pc/clue/CluePluginService');

class CluePluginController extends ClueBaseController {
  // 初始化线索插件
  async initCluePlugin(ctx) {
    const { kdtId, query } = ctx;
    query.operator = this.formatOperator;
    const data = await new CluePluginService(ctx).initCluePlugin(kdtId, query);
    ctx.json(0, 'ok', data);
  }
}

module.exports = CluePluginController;
