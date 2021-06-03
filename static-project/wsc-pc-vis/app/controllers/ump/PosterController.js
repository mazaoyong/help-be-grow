const URL = require('@youzan/wsc-pc-base/app/lib/URL');
const BaseController = require('../base/BaseController');
const PosterService = require('../../services/owl/ump/poster/PosterFacade');
const PromotionEffectFacade = require('../../services/owl/ump/poster/PromotionEffectFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

class PosterController extends BaseController {
  async redirectToNewUrl(ctx) {
    await ctx.redirect(URL.site('/industry/fans-poster/list', 'v4'));
  }

  async getIndexHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await ctx.render('ump/poster/index.html');
  }
  // 查询海报列表
  async getListsJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    const pagable = {
      pageSize: req.pageSize,
      pageNumber: req.pageIndex,
    };

    const res = await new PosterService(ctx).find(kdtId, pagable, req);

    ctx.json(0, 'ok', res);
  }

  async getEffectListsJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    const pagable = {
      pageSize: req.pageSize,
      pageNumber: req.pageIndex,
    };

    const dto = {};
    dto.userLike = req.userLike;
    if (req.campusKdtId && req.campusKdtId.length > 0) {
      dto.campusKdtId = req.campusKdtId;
    }

    const res = await new PromotionEffectFacade(ctx).find(kdtId, pagable, req);

    ctx.json(0, 'ok', res);
  }

  // 创建海报活动
  async postActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new PosterService(ctx).create(kdtId, req);

    return ctx.json(0, 'ok', res);
  }

  // 删除海报活动
  async deleteActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const { posterId } = ctx.request.body || {};

    const res = await new PosterService(ctx).delete(kdtId, posterId);

    return ctx.json(0, 'ok', res);
  }

  // 获取海报详情
  async getActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const { posterId } = ctx.request.query || {};

    const res = await new PosterService(ctx).getById(kdtId, posterId);

    return ctx.json(0, 'ok', res);
  }

  // 更新海报活动
  async putActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new PosterService(ctx).edit(kdtId, req);

    return ctx.json(0, 'ok', res);
  }

  // 推广海报活动
  async popularize(ctx) {
    const kdtId = ctx.kdtId;
    const { posterId } = ctx.request.query || {};

    const res = await new PosterService(ctx).popularize(kdtId, posterId);

    return ctx.json(0, 'ok', res);
  }

  // 结束海报活动
  async terminate(ctx) {
    const kdtId = ctx.kdtId;
    const { posterId } = ctx.request.query || {};

    const res = await new PosterService(ctx).terminate(kdtId, posterId);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = PosterController;
