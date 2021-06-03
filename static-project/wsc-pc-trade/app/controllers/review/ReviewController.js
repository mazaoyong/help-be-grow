const ReviewBaseController = require('./ReviewBaseController');
const ItemEvaluationReadService = require('../../services/review/ItemEvaluationReadService');
const ItemEvaluationWriteService = require('../../services/review/ItemEvaluationWriteService');
const HQStoreSearchService = require('../../services/retail/HQStoreSearchService');
const ShopConfigReadService = require('../../services/shop/ShopConfigReadService');
// @youzan/utils 导出包为es-module形式
const formatDate = require('@youzan/utils/date/formatDate').default;
const omitBy = require('lodash/omitBy');
const isNil = require('lodash/isNil');
const isNaN = require('lodash/isNaN');
const utilsShop = require('@youzan/utils-shop');
const { appName } = require('../../constants');

class ReviewController extends ReviewBaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '评价管理';
  }

  /**
   * 获取操作人信息并转换为json字符串
   * @param ctx
   * @returns {string}
   */
  getStringifyOperatorInfo(ctx) {
    const userInfo = ctx.getLocalSession('userInfo');
    return JSON.stringify({
      // eslint-disable-next-line camelcase
      user_id: userInfo.id,
      // eslint-disable-next-line camelcase
      nick_name: userInfo.nickName,
    });
  }

  async getIndexHtml(ctx) {
    await ctx.render('review/index.html');
  }

  /**
   * 获取评价列表
   * @param {*} ctx
   */
  async getReviewList(ctx) {
    const { kdtId } = ctx;
    const operator = this.getStringifyOperatorInfo(ctx);
    const shopInfo = ctx.getState('shopInfo');
    const { shopRole } = this.ctx.getState('shopInfo');

    const {
      startTime,
      endTime,
      evaluationMethod,
      goodsName,
      pageNo,
      pageSize,
      score,
      storeId,
      orderNo,
      itemName,
      subShopKdtId,
      stickType,
      hasPicture,
      isExcellented,
      itemId,
      parentItemId,
    } = ctx.query;
    const param = {
      operator,
      startTime: startTime ? formatDate(Number(startTime), 'YYYY-MM-DD HH:mm:ss') : '',
      endTime: endTime ? formatDate(Number(endTime), 'YYYY-MM-DD HH:mm:ss') : '',
      evaluationMethod,
      goodsName,
      kdtId,
      pageNo,
      pageSize,
      score,
      orderNo,
      itemName,
      stickType,
      itemId: +itemId,
      hasPicture: +hasPicture,
      isExcellented: +isExcellented,
      parentItemId: +parentItemId,
    };

    // 分店查询的时候，storeId 传 kdtId
    if (shopRole === 2) {
      param.storeId = kdtId;
    } else {
      param.storeId = storeId;
    }

    // 零售合伙人添加partnerKdtId
    if (utilsShop.checkPartnerStore(shopInfo)) {
      param.partnerKdtId = kdtId;
      delete param.kdtId;
    }

    // 微商城连锁总店查询，查询子店则storeId传子店的kdtId
    if (
      (utilsShop.checkWscHqStore(shopInfo) || utilsShop.checkRetailMinimalistHqStore(shopInfo)) &&
      +subShopKdtId
    ) {
      param.storeId = +subShopKdtId;
    }

    const filterParam = omitBy(param, val => isNaN(val) || isNil(val) || val === '');
    const result = await new ItemEvaluationReadService(ctx).pageEvaluationComment4B(filterParam);
    ctx.json(0, 'ok', result);
  }

  /**
   * 提交评价
   * @param {*} ctx
   */
  async submitReview(ctx) {
    const { kdtId } = ctx;
    const { content, evaluationId, reviewerId } = ctx.request.body;
    const operator = this.getStringifyOperatorInfo(ctx);
    const param = {
      kdtId,
      operator,
      content,
      evaluationId,
      anonymousType: 0,
      evaluationType: 4,
      reviewerId,
    };

    const result = await new ItemEvaluationWriteService(ctx).createEvaluation(param);
    ctx.json(0, 'ok', result);
  }

  /**
   * 获取门店列表
   * @param {*} ctx
   */
  async getStoreList(ctx) {
    const { kdtId, query } = ctx;
    const { keyword } = query;
    const userInfo = ctx.getLocalSession('userInfo');
    const param = {
      adminId: userInfo.id,
      kdtId,
      storeName: keyword,
      shopRoleList: [2],
      retailSource: 'wsc',
    };
    const shopInfo = ctx.getState('shopInfo');
    let result;
    if (utilsShop.checkUnifiedShop(shopInfo)) {
      // 零售3.0店铺 总部只返回网店列表
      param.isOnlineOpen = true;
      param.hqKdtId = kdtId;
      result = await new HQStoreSearchService(ctx).searchWithDataPermission(param);
    } else if (utilsShop.checkPartnerStore(shopInfo)) {
      // 零售3.0合伙人 仅返回网店列表
      param.isOnlineOpen = true;
      param.partnerKdtId = kdtId;
      result = await new HQStoreSearchService(ctx).searchWithDataPermission(param);
    } else {
      result = await new HQStoreSearchService(ctx).search(param);
    }
    ctx.json(0, 'ok', result);
  }

  /**
   * 置顶评论
   * @param {Context} ctx
   */
  async stickReview(ctx) {
    const { kdtId } = ctx;
    const { evaluationId, alias } = ctx.request.body;
    const operator = this.getStringifyOperatorInfo(ctx);
    const params = {
      kdtId,
      evaluationId: +evaluationId,
      alias,
      fromApp: appName,
      operator,
    };
    const result = await new ItemEvaluationWriteService(ctx).stickItemEvaluation(params);
    ctx.successRes(result);
  }

  /**
   * 取消置顶评论
   * @param {Context} ctx
   */
  async unStickReview(ctx) {
    const { kdtId } = ctx;
    const { evaluationId, alias } = ctx.request.body;
    const operator = this.getStringifyOperatorInfo(ctx);
    const result = await new ItemEvaluationWriteService(ctx).unStickItemEvaluation({
      kdtId,
      evaluationId: +evaluationId,
      alias,
      fromApp: appName,
      operator,
    });
    ctx.successRes(result);
  }

  /**
   * 加精评论
   */
  async addExcellentEvaluation(ctx) {
    const { kdtId } = ctx;
    const { evaluationItemId } = ctx.request.body;
    const operator = this.getStringifyOperatorInfo(ctx);
    const result = await new ItemEvaluationWriteService(ctx).addExcellentEvaluation({
      kdtId,
      evaluationItemId: +evaluationItemId,
      fromApp: appName,
      operator,
    });
    ctx.successRes(result);
  }

  /**
   * 取消加精评论
   */
  async cancelExcellentEvaluation(ctx) {
    const { kdtId } = ctx;
    const { evaluationItemId } = ctx.request.body;
    const operator = this.getStringifyOperatorInfo(ctx);
    const result = await new ItemEvaluationWriteService(ctx).cancelExcellentEvaluation({
      kdtId,
      evaluationItemId: +evaluationItemId,
      fromApp: appName,
      operator,
    });
    ctx.successRes(result);
  }

  /**
   * 获取买家秀状态
   * @param ctx
   * @return {Promise<*|number>}
   */
  async queryBuyersShowStatus(ctx) {
    const { kdtId } = ctx;
    const key = 'buyer_show';
    const result = (await new ShopConfigReadService(ctx).queryShopConfig(kdtId, key)) || {};
    ctx.successRes(result.value || 0);
  }
}

module.exports = ReviewController;
