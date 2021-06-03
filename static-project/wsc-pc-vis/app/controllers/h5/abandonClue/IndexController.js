/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const ClueOperateService = require('../../../services/owl/pc/clue/ClueOperateService');

class IndexController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('h5/abandon-clue.html');
  }

  async giveUpClues(ctx) { // 转让线索保存逻辑
    const { kdtId } = ctx;
    const { clueIds, reason } = ctx.request.body;
    const userId = ctx.getLocalSession('userInfo').id;
    const mobile = ctx.getLocalSession('userInfo').mobile;
    const source = 'wsc-pc-vis';
    const command = {
      clueIds,
      operator: {
        userId,
        mobile,
        source,
      },
      reason,
    };
    const res = await new ClueOperateService(ctx).giveUpClues(kdtId, command);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
