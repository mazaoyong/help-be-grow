const KnowledgeBaseController = require('../KnowledgeBaseController');
const SubscriptionService = require('../../../services/knowledge/blocks/SubscriptionService');
const VipBenefitService = require('../../../services/knowledge/blocks/VipBenefitService');
const ClientSubsAggregateFacade = require('../../../services/api/owl/api/ClientSubsAggregateFacade');

class MyPayController extends KnowledgeBaseController {
  // 获取已购专栏
  async findSubsColumnList(ctx) {
    const kdtId = ctx.kdtId;
    const { pageNumber, pageSize } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const query = {
      userId: ctx.buyerId,
    };
    const ret = await new SubscriptionService(ctx).findSubsColumnList([kdtId, pageRequest, query]);
    ctx.json(0, 'ok', ret);
  }

  // 获取已购内容和直播
  async findSubsContentAndLiveList(ctx) {
    const kdtId = ctx.kdtId;
    const { pageNumber, pageSize } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const query = {
      userId: ctx.buyerId,
    };
    const ret = await new SubscriptionService(ctx).findSubsContentAndLiveList([kdtId, pageRequest, query]);
    ctx.json(0, 'ok', ret);
  }

  // 获取已购会员权益
  async getVipUserAllBenefitPkg(ctx) {
    const kdtId = ctx.kdtId;
    const buyerId = ctx.buyerId;
    const ret = await new VipBenefitService(ctx).getVipUserAllBenefitPkg([kdtId, buyerId]);
    ctx.json(0, 'ok', ret);
  }

  // 获取已购内容
  async getContentList(ctx) {
    await this._getTabList(ctx, 2);
  }

  // 我的课程页面：专栏、内容、会员页信息聚合接口
  async _getTabList(ctx, tabCode) {
    const kdtId = ctx.kdtId;
    const { pageNumber, pageSize } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const query = {
      userId: ctx.buyerId,
      tabCode,
    };
    const res = await new ClientSubsAggregateFacade(
      ctx
    ).findMyCourseAggregationInfo(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }
}

module.exports = MyPayController;
