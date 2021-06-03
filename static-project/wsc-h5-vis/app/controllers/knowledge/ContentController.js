const KnowledgeBaseController = require('./KnowledgeBaseController');
const ContentService = require('../../services/knowledge/ContentService');
const ClientContentFacade = require('../../services/api/owl/api/ClientContentFacade');
const OnlineCourseAttributeService = require('../../services/owl/api/OnlineCourseAttributeService');
const ActivityRewardService = require('../../services/owl/api/ActivityRewardService');
const ContentFacade = require('../../services/owl/pc/onlinecourse/ContentFacade');

const SIZE = 10;

class ContentController extends KnowledgeBaseController {
  /**
   * 获取全部内容列表，如果有专栏alias则为专栏下的内容列表
   */
  async getContentsJson(ctx) {
    const { page_no: page, alias: columnAlias } = ctx.query;
    const contents = await new ContentService(ctx)
      .getContentList(ctx.kdtId, page || 1, columnAlias || '', SIZE);
    ctx.json(0, 'ok', contents);
  }

  /**
   * 获取全部内容(包含直播)列表，如果有专栏alias则为专栏下的内容列表
   */
  async getContentsAndLivesJson(ctx) {
    const { page_no: page, alias: columnAlias } = ctx.query;
    const contents = await new ContentService(ctx)
      .getContentAndLiveList(ctx.kdtId, page || 1, columnAlias || '', SIZE);
    ctx.json(0, 'ok', contents);
  }

  /**
   * 内容详情
   */
  async getContentJson(ctx) {
    const { alias } = ctx.query;
    const column = await new ContentService(ctx).getContent(ctx.kdtId, ctx.buyerId, alias || '');
    ctx.json(0, 'ok', column);
  }

  /**
   * 购买的内容
   */
  async getPaidContentsJson(ctx) {
    const { page_no: pageNo } = ctx.query;
    const columns = await new ContentService(ctx)
      .getSubscriptionsContentList(ctx.kdtId, ctx.buyerId, pageNo || 1, SIZE);
    ctx.json(0, 'ok', columns);
  }

  // 内容列表
  async getContentListJson(ctx) {
    const { kdtId, buyerId } = ctx;
    const { pageNumber, pageSize = 10 } = ctx.query;
    const query = { kdtId, buyerId };
    const pageRequest = { pageNumber, pageSize };

    const result = await new ClientContentFacade(ctx).findPageByCondition(kdtId, query, pageRequest);
    ctx.json(0, 'ok', result);
  }

  // 内容详情
  async getContentDetail(ctx) {
    const { kdtId, buyerId, platform } = ctx;
    const { alias, sortType } = ctx.query;
    const isWechatEnvironment = platform === 'weixin';
    const query = {
      userId: buyerId,
      alias,
      isWechatEnvironment,
      sortType,
    };
    const result = await new ClientContentFacade(ctx).getContentAggregateDetail(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  // 获取领取页面知识付费商品信息
  async getKnowledgeByAlias(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const buyerInfo = ctx.visBuyer;

    const result = await new OnlineCourseAttributeService(ctx).findProductCollectInfo(kdtId, {
      ...query,
      userId: buyerInfo.user.user_id,
    });
    ctx.json(0, 'ok', result);
  }

  // 通用提交信息采集资料项
  async submitCollectInfo(ctx) {
    const { kdtId } = ctx;
    const command = ctx.getPostData();
    const buyerInfo = ctx.visBuyer;

    const result = await new OnlineCourseAttributeService(ctx).submitAttributes(kdtId, {
      ...command,
      userId: buyerInfo.user.user_id,
    });

    ctx.json(0, 'ok', result);
  }

  // 提交领取奖品信息
  async getKnowledgeReward(ctx) {
    const { kdtId } = ctx;
    const command = ctx.getPostData();
    const buyerInfo = ctx.visBuyer;
    command.userWrap = {
      fansId: buyerInfo.fansId,
      fansType: buyerInfo.fansType,
      userId: buyerInfo.user.user_id,
    };

    const result = await new ActivityRewardService(ctx).reward(kdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 供应店铺分销内容详情
  async getDetailByAlias(ctx) {
    const { kdtId = 0 } = ctx;
    const { alias = '' } = ctx.getQueryParse();
    const result = await new ContentFacade(ctx).getDetailByAlias(kdtId, alias);
    ctx.json(0, 'ok', result);
  }
}

module.exports = ContentController;
