/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const ClueSettingPcService = require('../../../services/owl/pc/clue/enrollsetting/ClueSettingPcService');
const ClueTransferReasonPcService = require('../../../services/owl/pc/clue/ClueTransferReasonPcService');
const ClueOperateService = require('../../../services/owl/pc/clue/ClueOperateService');

class IndexController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('h5/transfer-clue.html');
  }

  async findStaffPage(ctx) { // 获取转让人列表
    const { kdtId } = ctx;
    const { pageNumber, pageSize } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const res = await new ClueSettingPcService(ctx).findStaffPage(kdtId, pageRequest);

    return ctx.json(0, 'ok', res);
  }

  async findTransferReasonPage(ctx) { // 获取转让原因
    const { kdtId } = ctx;
    const { pageNumber, pageSize } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const res = await new ClueTransferReasonPcService(ctx).findTransferReasonPage(kdtId, pageRequest);

    return ctx.json(0, 'ok', res);
  }

  async transferClues(ctx) { // 转让线索保存逻辑
    const { kdtId } = ctx;
    const { clueIds, targetUserId, reason } = ctx.request.body;
    const userId = ctx.getLocalSession('userInfo').id;
    const mobile = ctx.getLocalSession('userInfo').mobile;
    const source = 'wsc-pc-vis';
    const clueCommand = {
      clueIds,
      targetUserId,
      operator: {
        userId,
        mobile,
        source,
      },
      reason,
    };
    const res = await new ClueOperateService(ctx).transferClues(kdtId, clueCommand);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
