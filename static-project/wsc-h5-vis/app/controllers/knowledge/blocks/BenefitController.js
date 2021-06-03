const KnowledgeBaseController = require('../KnowledgeBaseController');
const BenefitFacade = require('../../../services/owl/benefit/BenefitFacade');

class BenefitController extends KnowledgeBaseController {
  // 获取权益包详情
  async getBenefitPackageDetailJson(ctx) {
    const operatorKdtId = ctx.kdtId;
    const query = ctx.query;
    const command = {
      alias: query.alias,
      userId: ctx.buyerId,
      kdtId: ctx.kdtId,
    };
    const result = await new BenefitFacade(ctx).getBenefitPackageDetail(operatorKdtId, command);
    ctx.json(0, 'ok', result);
  };

  // 获取权益包下关联的内容，专栏，直播
  async getFindBenefitItemDetailPageJson(ctx) {
    const operatorKdtId = ctx.kdtId;
    const query = ctx.query;
    const pageRequest = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    };
    const command = {
      packageAlias: query.alias,
      userId: ctx.buyerId,
      kdtId: ctx.kdtId,
      type: query.type,
      // 状态过滤:定义为【 0:删除 1:上架 2:下架 3:暂存 4:定时上架 】
      status: [1, 2, 3],
    };
    const result = await new BenefitFacade(ctx).findBenefitItemDetailPage(operatorKdtId, pageRequest, command);
    ctx.json(0, 'ok', result);
  }

  // C端微页面全部会员权益购买详情列表,兼容微页面的数据逻辑，所以接口不规范
  async getBenefitPackageAllBuyDetailJson(ctx) {
    const query = ctx.query;
    const result = await new BenefitFacade(ctx).getBenefitPackageAllBuyDetail(
      ctx.kdtId,
      query.pageNumber,
      query.pageSize,
      ctx.userId
    );
    ctx.json(0, 'ok', result);
  }

  async getVipBenefitPackagesJson(ctx) {
    const kdtId = ctx.kdtId;
    const buyerId = ctx.userId;
    const result = await new BenefitFacade(ctx).getVipBenefitPackages(kdtId, buyerId);
    ctx.json(0, 'ok', result);
  }
}

module.exports = BenefitController;
