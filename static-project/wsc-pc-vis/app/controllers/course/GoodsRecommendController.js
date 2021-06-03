const BaseController = require('../base/BaseController');
const GoodsRecommendService = require('../../services/paidcontent/GoodsRecommendService');
const GoodsSelectorItemService = require('../../services/paidcontent/GoodsSelectorItemService');

class GoodsRecommendController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('course/recommend/index.html');
  }

  async findRecommend(ctx) {
    const req = ctx.request.query || {};
    req.kdtId = ctx.kdtId;
    const result = await new GoodsRecommendService(ctx).findRecommend(req);

    const itemIds =
      result &&
      result.nonOwlModule &&
      result.nonOwlModule.recommends &&
      result.nonOwlModule.recommends.map(recommend => recommend.productId);

    // 给实物商品加上分销的标
    if (itemIds) {
      const realResult = await new GoodsSelectorItemService(ctx).getGoodsListByItemIds(
        ctx.kdtId,
        itemIds,
      );
      const realDistributedGoodIds =
        realResult &&
        realResult.items &&
        realResult.items.filter(item => item.goodsType === 10).map(item => item.id);

      if (realDistributedGoodIds) {
        result.nonOwlModule.recommends.forEach(recommend => {
          if (realDistributedGoodIds.includes(recommend.productId)) {
            recommend.owlType = 1;
          }
        });
      }
    }

    ctx.json(0, 'ok', result);
  }

  async createMediaEndingRecommend(ctx) {
    const req = ctx.request.body || {};
    req.kdtId = ctx.kdtId;
    const result = await new GoodsRecommendService(ctx).createMediaEndingRecommend(req);
    ctx.json(0, 'ok', result);
  }

  async changeMediaEndingRecommend(ctx) {
    const req = ctx.request.body || {};
    req.target && (req.target.kdtId = ctx.kdtId);
    const result = await new GoodsRecommendService(ctx).changeMediaEndingRecommend(req);
    ctx.json(0, 'ok', result);
  }

  async deleteMediaEndingRecommend(ctx) {
    const req = ctx.request.body || {};
    req.kdtId = ctx.kdtId;
    const result = await new GoodsRecommendService(ctx).deleteMediaEndingRecommend(req);
    ctx.json(0, 'ok', result);
  }

  async createPageDetailRecommend(ctx) {
    const req = ctx.request.body || {};
    req.kdtId = ctx.kdtId;
    const result = await new GoodsRecommendService(ctx).createPageDetailRecommend(req);
    ctx.json(0, 'ok', result);
  }

  async changePageDetailRecommend(ctx) {
    const req = ctx.request.body || {};
    req.target && (req.target.kdtId = ctx.kdtId);
    const result = await new GoodsRecommendService(ctx).changePageDetailRecommend(req);
    ctx.json(0, 'ok', result);
  }

  async deletePageDetailRecommend(ctx) {
    const req = ctx.request.body || {};
    req.kdtId = ctx.kdtId;
    const result = await new GoodsRecommendService(ctx).deletePageDetailRecommend(req);
    ctx.json(0, 'ok', result);
  }
}

module.exports = GoodsRecommendController;
