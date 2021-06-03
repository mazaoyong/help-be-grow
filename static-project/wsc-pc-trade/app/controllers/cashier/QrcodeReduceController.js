const BaseController = require('../base/BaseController');
const ScanReducePromotionService = require('../../services/ump/ScanReducePromotionService');

class QrcodeReduceController extends BaseController {
  /**
   * 获取优惠列表(分页)
   * @param {AstroboyContext} ctx
   */
  async getPromotionList(ctx) {
    const { kdtId } = ctx;
    const { page, pageSize } = ctx.query;
    let realKdtId = kdtId;

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      realKdtId = liteKdtId || kdtId;
    }
    const result = await new ScanReducePromotionService(ctx).getScanReduceList(
      realKdtId,
      page,
      pageSize,
    );
    ctx.json(0, 'ok', result);
  }

  /**
   * 创建优惠活动
   * @param {AstroboyContext} ctx
   */
  async createPromotion(ctx) {
    const { kdtId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      enable: true,
      canRepeat: true,
      scanType: 'WSC',
      present: '',
      qrcodeId: 0,
    };

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }

    const result = await new ScanReducePromotionService(ctx).create(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 编辑优惠活动
   * @param {AstroboyContext} ctx
   */
  async editPromotion(ctx) {
    const { kdtId } = ctx;
    const { activityId, ...rest } = ctx.request.body;
    const params = {
      ...rest,
      kdtId,
      enable: true,
      canRepeat: true,
      scanType: 'WSC',
      present: '',
      qrcodeId: 0,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }

    const result = await new ScanReducePromotionService(ctx).edit(activityId, params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 优惠活动失效
   * @param {AstroboyContext} ctx
   */
  async invalidPromotion(ctx) {
    const { kdtId } = ctx;

    let realKdtId = kdtId;

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      realKdtId = liteKdtId || kdtId;
    }

    const { activityId } = ctx.request.body;

    const result = await new ScanReducePromotionService(ctx).invalidV2(realKdtId, activityId);
    ctx.json(0, 'ok', result);
  }

  /**
   * 获取当前优惠活动
   * @param {AstroboyContext} ctx
   */
  async getValidPromotion(ctx) {
    const { kdtId } = ctx;

    let realKdtId = kdtId;

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      realKdtId = liteKdtId || kdtId;
    }

    const result = await new ScanReducePromotionService(ctx).getValidByScanTypeV2(realKdtId, 'WSC');
    ctx.json(0, 'ok', result);
  }
}

module.exports = QrcodeReduceController;
