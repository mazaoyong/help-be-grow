const BaseController = require('../base/BaseController');
const PcSelfFetchService = require('../../services/ebiz/PcSelfFetchService');

class SelfFetchServiceController extends BaseController {
  /**
   * 获取自提信息
   * @param {*} ctx
   */
  async getSelfFetch(ctx) {
    const { kdtId, query, rootKdtId: headKdtId } = ctx;
    const params = {
      ...query,
      kdtId,
      headKdtId,
    };
    const data = await new PcSelfFetchService(ctx).queryVerifySelfFetch(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 验证自提
   * @param {*} ctx
   */
  async verifySelfFetch(ctx) {
    const { kdtId, userId: adminId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      headKdtId,
      adminId,
    };
    const data = await new PcSelfFetchService(ctx).verify(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 自提验证记录列表
   * @param {*} ctx
   */
  async getSelfFetchVerifyList(ctx) {
    const { kdtId, query, userId: adminId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...query,
      headKdtId,
      kdtId,
      adminId,
    };
    const data = await new PcSelfFetchService(ctx).listSelfFetch(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 自提验证记录列表导出
   */
  async exportSelfFetch(ctx) {
    const { kdtId, userId: adminId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      headKdtId,
      adminId,
    };
    const data = await new PcSelfFetchService(ctx).exportSelfFetch(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 自提验证记录列表导出列表
   */
  async getSelfFetchExportList(ctx) {
    const { kdtId, rootKdtId: headKdtId } = ctx;
    const params = {
      ...ctx.query,
      kdtId,
      headKdtId,
    };
    const data = await new PcSelfFetchService(ctx).listExportRecord(params);
    ctx.json(0, 'ok', data);
  }
}

module.exports = SelfFetchServiceController;
