const BaseController = require('../base/BaseController');
const CollectZanService = require('../../services/api/owl/CollectZanService');
const CollectZanFacadeService = require('../../services/owl/ump/collectzan/CollectZanFacade');
const OwlProductFacadeService = require('../../services/owl/ic/aggregate/OwlProductAggregateFacade');
const PromotionEffectFacadeService = require('../../services/owl/ump/poster/PromotionEffectFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

class BoostController extends BaseController {
  async getIndexHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await ctx.render('ump/boost/index.html');
  }

  // 创建好友助力
  async createAvtive(ctx) {
    const kdtId = ctx.kdtId;
    const createCollectZanCommand = ctx.request.body || {};

    const res = await new CollectZanFacadeService(ctx).create(kdtId, createCollectZanCommand);
    ctx.json(0, 'ok', res);
  }

  // 删除好友助力
  async deleteActive(ctx) {
    const kdtId = ctx.kdtId;
    const { id } = ctx.request.body || {};

    const res = await new CollectZanFacadeService(ctx).delete(kdtId, id);
    ctx.json(0, 'ok', res);
  }

  // 更新好友助力
  async updateAvtive(ctx) {
    const kdtId = ctx.kdtId;
    const updateCollectZanCommand = ctx.request.body || {};

    const res = await new CollectZanFacadeService(ctx).update(kdtId, updateCollectZanCommand);
    ctx.json(0, 'ok', res);
  }

  // 新版创建好友助力
  async createActivity(ctx) {
    const kdtId = ctx.kdtId;
    const command = ctx.request.body || {};
    const res = await new CollectZanFacadeService(ctx).createTemplate(kdtId, command);
    return ctx.json(0, 'ok', res);
  }

  // 新版更新好友助力
  async updateActivity(ctx) {
    const kdtId = ctx.kdtId;
    const command = ctx.request.body || {};
    const res = await new CollectZanFacadeService(ctx).updateTemplate(kdtId, command);
    return ctx.json(0, 'ok', res);
  }

  // 结束好友助力活动
  async invalidActive(ctx) {
    const kdtId = ctx.kdtId;
    const { id } = ctx.request.body || {};

    const res = await new CollectZanFacadeService(ctx).invalid(kdtId, id);
    ctx.json(0, 'ok', res);
  }

  // 获取好友助力列表
  async getActiveList(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.getQueryParse();
    const { pageRequest, zanQuery } = query;
    const res = await new CollectZanFacadeService(ctx).find(kdtId, pageRequest, zanQuery);
    ctx.json(0, 'ok', res);
  }

  // 获取好友助力
  async getActive(ctx) {
    const kdtId = ctx.kdtId;
    const { id } = ctx.request.query;
    const res = await new CollectZanFacadeService(ctx).getById(kdtId, id);
    ctx.json(0, 'ok', res);
  }

  async getGoodsListJson(ctx) {
    const kdtId = ctx.kdtId;
    const { keyword, page, types, pageSize } = ctx.request.query;

    const result = await new CollectZanService(ctx).findGoodsListByKdtId(
      kdtId,
      keyword,
      page,
      types,
      pageSize,
    );
    return ctx.r(0, 'ok', result);
  }

  async getSelectedGoodsListJson(ctx) {
    const kdtId = ctx.kdtId;
    let { productIds = '' } = ctx.request.query;
    productIds = productIds.split(',');

    const result = await new OwlProductFacadeService(ctx).find(kdtId, { productIds });
    return ctx.r(0, 'ok', result);
  }

  async listHistoryListJson(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.request.body;
    const result = await new PromotionEffectFacadeService(ctx).findCollectZanPromotionEffect(
      kdtId,
      pageRequest,
      query,
    );
    return ctx.r(0, 'ok', result);
  }
}

module.exports = BoostController;
