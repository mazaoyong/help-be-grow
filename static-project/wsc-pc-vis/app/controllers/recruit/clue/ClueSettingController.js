const ClueBaseController = require('./ClueBaseController');
const ClueSettingPcService = require('../../../services/owl/pc/clue/enrollsetting/ClueSettingPcService');
class ClueSettingController extends ClueBaseController {
  async getIndexHTML(ctx) {
    await this.initPluginStatus();
    await ctx.render('recruit/clue/cluesetting.html');
  }

  // 获取线索设置
  async getClueSettingJson(ctx) {
    const { kdtId } = ctx;

    const data = await new ClueSettingPcService(ctx).getClueSetting(kdtId);

    ctx.json(0, 'ok', data);
  }

  // 保存线索设置
  async updateClueSettingJson(ctx) {
    const { kdtId, request } = ctx;
    const command = request.body;
    command.operator = this.formatOperator;

    const data = await new ClueSettingPcService(ctx).saveClueSetting(kdtId, command);

    ctx.json(0, 'ok', data);
  }
}

module.exports = ClueSettingController;
