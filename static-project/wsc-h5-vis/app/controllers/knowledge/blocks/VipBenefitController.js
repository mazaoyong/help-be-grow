const KnowledgeBaseController = require('../KnowledgeBaseController');
const VipBenefitService = require('../../../services/knowledge/blocks/VipBenefitService');

const SIZE = 10;

class VipBenefitController extends KnowledgeBaseController {
  /**
   * 获取权益包详情
   */
  async getVipBenefitJson(ctx) {
    const { alias } = ctx.query;
    const ret = await new VipBenefitService(ctx)
      .getBenefitPkg(ctx.kdtId, alias, ctx.buyerId);
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取权益包专栏列表
   */
  async getBenefitPkgColumnsJson(ctx) {
    const { page_no: page, page_size: pageSize, alias } = ctx.query;
    const ret = await new VipBenefitService(ctx)
      .getBenefitPkgColumnList(ctx.kdtId, alias, page, pageSize || SIZE);
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取权益包内容列表
   */
  async getBenefitPkgContentsJson(ctx) {
    const { page_no: page, page_size: pageSize, alias } = ctx.query;
    const ret = await new VipBenefitService(ctx)
      .getBenefitPkgContentList(ctx.kdtId, alias, page, pageSize || SIZE);
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取已订阅的权益包列表
   */
  async getSubscriptionBenefitPkgJson(ctx) {
    const ret = await new VipBenefitService(ctx)
      .getSubscriptionBenefitList(ctx.kdtId, ctx.buyerId);
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取全部权益
   */
  async getBenefitPkgWithCountJson(ctx) {
    const { page, page_size: pageSize } = ctx.query;
    const ret = await new VipBenefitService(ctx)
      .getBenefitsWithCount(ctx.kdtId, page, pageSize || SIZE);
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取权益包列表（?废弃）
   */
  async getBenefitPackageJson(ctx) {
    const { page, page_size: pageSize } = ctx.query;
    const ret = await new VipBenefitService(ctx)
      .getBenefitList(ctx.kdtId, page, pageSize || SIZE);
    ctx.json(0, 'ok', ret);
  }
}

module.exports = VipBenefitController;
