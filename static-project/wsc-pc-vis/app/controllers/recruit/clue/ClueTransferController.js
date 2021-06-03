const ClueBaseController = require('./ClueBaseController');
const ClueTransferReasonPcService = require('../../../services/owl/pc/clue/enrollsetting/ClueTransferReasonPcService');

class ClueTransferController extends ClueBaseController {
  async getIndexHTML(ctx) {
    await this.initPluginStatus();
    await ctx.render('recruit/clue/cluetransfer.html');
  }

  // 分页查询流转原因
  async findTransferReasonPageByQuery(ctx) {
    const { kdtId } = ctx;
    const { pageRequest = {}, query = null } = ctx.getQueryParse();
    const data = await new ClueTransferReasonPcService(ctx).findTransferReasonPageByQuery(
      kdtId,
      pageRequest,
      query,
    );
    return ctx.json(0, 'ok', data);
  }

  // 创建流转原因
  async createTransferReason(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body || {};
    const data = await new ClueTransferReasonPcService(ctx).createTransferReason(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  // 更新流转原因
  async updateTransferReason(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body || {};
    const data = await new ClueTransferReasonPcService(ctx).updateTransferReason(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  // 删除流转原因
  async deleteTransferReason(ctx) {
    const { kdtId } = ctx;
    const { reasonId } = ctx.request.body || {};
    const data = await new ClueTransferReasonPcService(ctx).deleteTransferReason(kdtId, reasonId);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = ClueTransferController;
