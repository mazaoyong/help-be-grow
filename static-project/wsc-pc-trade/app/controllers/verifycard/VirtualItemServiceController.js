const BaseController = require('../base/BaseController');
const PcVirtualItemService = require('../../services/ebiz/PcVirtualItemService');

class VirtualItemService extends BaseController {
  /**
   * 查询虚拟商品详情
   * @param {*} ctx
   */
  async getVirtualItemDetail(ctx) {
    const { kdtId, query, rootKdtId: headKdtId } = ctx;

    const params = {
      ...query,
      kdtId,
      headKdtId,
    };
    const data = await new PcVirtualItemService(ctx).queryVerifyVirtualItem(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 核销虚拟商品
   */
  async verifyVirtualItem(ctx) {
    const { kdtId, userId: adminId, rootKdtId: headKdtId } = ctx;

    const params = {
      ...ctx.request.body,
      kdtId,
      headKdtId,
      adminId,
    };
    const data = await new PcVirtualItemService(ctx).verify(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 虚拟商品核销记录列表
   */
  async getVirtualItemVerifyList(ctx) {
    const { kdtId, query, userId: adminId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...query,
      kdtId,
      headKdtId,
      adminId,
    };
    const data = await new PcVirtualItemService(ctx).listVirtualItem(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 虚拟商品核销记录列表导出
   */
  async exportVirtualItem(ctx) {
    const { kdtId, userId: adminId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      headKdtId,
      adminId,
    };
    const data = await new PcVirtualItemService(ctx).exportVirtualItem(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 虚拟商品核销记录列表导出列表
   */
  async getVirtualTradeExportList(ctx) {
    const { kdtId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...ctx.query,
      kdtId,
      headKdtId,
    };
    const data = await new PcVirtualItemService(ctx).listExportRecord(params);
    ctx.json(0, 'ok', data);
  }
}

module.exports = VirtualItemService;
