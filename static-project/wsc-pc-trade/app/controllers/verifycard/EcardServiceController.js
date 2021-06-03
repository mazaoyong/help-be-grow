const BaseController = require('../base/BaseController');
const PcVirtualTicketService = require('../../services/ebiz/PcVirtualTicketService');
const IcItemQueryService = require('../../services/ic/ItemQueryService');

class VirtualTicketServiceController extends BaseController {
  async getVerifyHtml(ctx) {
    await this.initStoreId();
    await this.initTeamAdmin();
    await ctx.render('verifycard/verifycard.html');
  }

  async getGoodsList(ctx) {
    const {
      kdtId,
      request: { query },
    } = ctx;
    const params = {
      page: 1,
      pageSize: 20,
      isDisplays: [0, 1],
      showSoldOut: 2,
      ...query,
      kdtId,
    };
    const data = await new IcItemQueryService(ctx).listItemsPaged(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 获取卡券订单列表
   */
  async getEcardOrderList(ctx) {
    const { kdtId, query, rootKdtId: headKdtId } = ctx;
    const params = {
      ...query,
      headKdtId,
      kdtId,
    };
    const data = await new PcVirtualTicketService(ctx).listVerifyVirtualTicket(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 根据订单号获取订单的卡券列表
   */
  async getEcardsByOrderNo(ctx) {
    const { kdtId, query, rootKdtId: headKdtId, userId: adminId } = ctx;
    const params = {
      ...query,
      headKdtId,
      adminId,
      kdtId,
    };
    const data = await new PcVirtualTicketService(ctx).queryVirtualTicketByOrderNo(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 查看卡券订单详情
   */
  async getEcardOrderDetail(ctx) {
    const { kdtId, query, rootKdtId: headKdtId, userId: adminId } = ctx;
    const params = {
      ...query,
      headKdtId,
      kdtId,
      adminId,
    };
    const data = await new PcVirtualTicketService(ctx).queryVerifyVirtualTicket(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 核销虚拟商品
   */
  async verifyEcards(ctx) {
    const { kdtId, userId: adminId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      headKdtId,
      adminId,
    };
    const data = await new PcVirtualTicketService(ctx).verify(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 获取核销记录列表
   */
  async getEcardVerifyList(ctx) {
    const { kdtId, query, userId: adminId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...query,
      headKdtId,
      kdtId,
      adminId,
    };
    const data = await new PcVirtualTicketService(ctx).listVirtualTicket(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 获取卡券有效期列表
   */
  async getDelayEcardList(ctx) {
    const { kdtId, query, rootKdtId: headKdtId } = ctx;
    const params = {
      ...query,
      headKdtId,
      kdtId,
    };
    const data = await new PcVirtualTicketService(ctx).listDelayVirtualTicket(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 卡券有效期延长列表--查看券码
   */
  async getEcardsByOrderNoAndStatus(ctx) {
    const { kdtId, query, rootKdtId: headKdtId } = ctx;
    const params = {
      ...query,
      headKdtId,
      kdtId,
    };
    const data = await new PcVirtualTicketService(ctx).listVirtualTicketItem(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 延迟电子卡券订单券码有效期
   */
  async extendEcard(ctx) {
    const { kdtId, userId: adminId, rootKdtId: headKdtId } = ctx;
    const query = {
      ...ctx.request.body,
      headKdtId,
      kdtId,
      adminId,
    };
    const data = await new PcVirtualTicketService(ctx).delayEndTime(query);
    ctx.json(0, 'ok', data);
  }

  /**
   * 核销记录导出
   */
  async exportEcardVerifyList(ctx) {
    const { kdtId, userId: adminId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...ctx.request.body,
      headKdtId,
      kdtId,
      adminId,
    };
    const data = await new PcVirtualTicketService(ctx).exportVirtualTicketRecord(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 核销记录导出列表
   */
  async getEcardExportList(ctx) {
    const { kdtId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...ctx.query,
      headKdtId,
      kdtId,
    };
    const data = await new PcVirtualTicketService(ctx).listExportRecord(params);
    ctx.json(0, 'ok', data);
  }
}

module.exports = VirtualTicketServiceController;
