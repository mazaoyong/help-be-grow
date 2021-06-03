// 快速回款
const BaseController = require('../base/BaseController');
const QuickSettleService = require('../../services/owl/pc/quicksettle/QuickSettlePCFacade');
const UnifiedQualificationCertQueryService = require('../../services/api/pay/cert/UnifiedQualificationCertQueryService');

class PaybackController extends BaseController {
  async getIndexHTML(ctx) {
    await ctx.render('other/payback/index.html');
  }

  async applyQuickSettleService(ctx) {
    const { kdtId } = ctx;
    const {
      clientIp,
      nickName,
      source,
      userId,
      mobile,
    } = this.formatOperator;
    const data = await new QuickSettleService(ctx).applyQuickSettleService(kdtId, {
      operatorType: 1,
      operator: {
        clientIp,
        source,
        mobile,
        nickName,
        userId,
      },
    });
    return ctx.json(0, 'ok', data);
  }

  async cancelQuickSettleService(ctx) {
    const { kdtId } = ctx;
    const {
      clientIp,
      nickName,
      source,
      userId,
      mobile,
    } = this.formatOperator;
    const data = await new QuickSettleService(ctx).cancelQuickSettleService(kdtId, {
      operatorType: 2,
      operator: {
        clientIp,
        source,
        mobile,
        nickName,
        userId,
      },
    });
    return ctx.json(0, 'ok', data);
  }

  async listRecordsWithService(ctx) {
    const { kdtId } = ctx;
    const { page } = ctx.query;
    const data = await new QuickSettleService(ctx).listRecordsWithService(kdtId, {
      pageNumber: page,
      pageSize: 10,
    });
    return ctx.json(0, 'ok', data);
  }

  async serviceCheck(ctx) {
    const { kdtId } = ctx;
    const data = await new QuickSettleService(ctx).serviceCheck(kdtId);
    return ctx.json(0, 'ok', data);
  }

  // 统一有效资质状态查询
  async queryUnitedQualStatus(ctx) {
    const { kdtId } = ctx;
    const data = await new UnifiedQualificationCertQueryService(ctx).queryUnitedQualStatus({
      sourceId: String(kdtId),
      sourceIdType: 'KDT_ID',
      unifiedQualificationType: 'YZ_EDUCATION_QUALIFICATION', // 教育资质查询
    });
    return ctx.json(0, 'ok', data);
  }
}

module.exports = PaybackController;
