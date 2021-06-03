const BaseController = require('../base/BaseController');
const BuyGiveActivityService = require('../../services/owl/BuyGiveActivityService');
const BuyGiveFacadeService = require('../../services/owl/ump/buygive/BuyGiveFacade');
const OwlProductFacadeService = require('../../services/owl/ic/aggregate/OwlProductAggregateFacade');
const DataCenterService = require('../../services/paidcontent/DataCenterService');
const PresentDubblService = require('../../services/ump/marketing/present/PresentDubboService');
const BuyGiveFacade = require('../../services/owl/pc/buygive/BuyGiveFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

/**
 * 买赠相关接口
 */
class FreebieController extends BaseController {
  async getIndexHtml(ctx) {
    const { kdtId } = ctx;

    // 店铺状态
    const shopStatuses = await this.callService(
      'wsc-pc-base/shop.ShopConfigReadService',
      'queryShopStatuses',
      kdtId,
    );

    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));
    ctx.setGlobal('shopStatuses', shopStatuses); // 店铺状态
    await this.setPointsName();
    await ctx.render('ump/freebie/index.html');
  }

  // 查询买赠列表
  async getListsJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.getQueryParse();
    const { zanQuery, pageRequest } = query || {};

    const res = await new BuyGiveFacadeService(ctx).getLists(kdtId, zanQuery, pageRequest);

    ctx.json(0, 'ok', res);
  }

  async getKnowledgeList(ctx) {
    const kdtId = ctx.kdtId;
    const { size, page, types } = ctx.request.query || {};
    const res = await new BuyGiveActivityService(ctx).getKnowledgeList(kdtId, size, page, types);

    return ctx.json(0, 'ok', res);
  }

  // 根据商品别名查询商品
  async getKnowledgeByAliasJson(ctx) {
    const kdtId = ctx.kdtId;
    const productIds = ctx.request.query.itemIds.split(',');

    const result = await new OwlProductFacadeService(ctx).find(kdtId, { productIds });
    return ctx.r(0, 'ok', result);
  }

  async findWithSku(ctx) {
    const kdtId = ctx.kdtId;

    const { productIds } = ctx.getQueryParse();
    const productArrayIds = productIds.split(',');
    const productIdSize = productArrayIds.length;
    const maxsize = 10;
    const result = [];
    let i = 0;
    while (i < productIdSize) {
      const end = (i + maxsize) > productIdSize ? productIdSize : (i + maxsize);
      const sliceIds = productArrayIds.slice(i, end);
      const resp = await new OwlProductFacadeService(ctx).findWithSku(kdtId, { productIds: sliceIds });
      result.push(...resp);
      i += maxsize;
    }
    return ctx.r(0, 'ok', result);
  }

  // 创建买赠活动
  async postActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const saveBuyGiveActivityDTO = ctx.request.body || {};

    const res = await new BuyGiveFacadeService(ctx).create(kdtId, saveBuyGiveActivityDTO);

    return ctx.json(0, 'ok', res);
  }

  // 根据 id 查询买赠活动详情
  // async getDetailById(ctx) {
  //   const kdtId = ctx.kdtId;
  //   const { id } = ctx.request.query;

  //   const res = await new BuyGiveFacadeService(ctx).getDetail(kdtId, id);

  //   return ctx.json(0, 'ok', res);
  // }

  // 修改买赠活动
  async putActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const editBuyGiveActivityDTO = ctx.request.body || {};

    const res = await new BuyGiveFacadeService(ctx).update(kdtId, editBuyGiveActivityDTO);

    return ctx.json(0, 'ok', res);
  }

  // 删除买赠活动
  async deleteActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const { id } = ctx.request.body;

    const res = await new BuyGiveFacadeService(ctx).delete(kdtId, id);

    return ctx.json(0, 'ok', res);
  }

  // 查询买赠效果数据;
  async getEffectDataJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.promotionId = req.promotionId.split(',');
    req.kdtId = kdtId;
    const data = await new DataCenterService(ctx).getEffectData(req);
    return ctx.json(0, 'ok', data);
  }

  // 获取赠品列表
  async findPage(ctx) {
    const param = ctx.getQueryParse();
    param.kdtId = ctx.kdtId;
    param.withGoodsInfo = true;
    param.withStatistics = true;
    param.channel = 0;
    const res = await new PresentDubblService(ctx).findPage(param);
    return ctx.json(0, 'ok', res);
  }

  // 买赠活动详情
  async getDetailById(ctx) {
    const kdtId = ctx.kdtId;
    const { id } = ctx.getQueryParse();
    const res = await new BuyGiveFacade(ctx).getDetailById(kdtId, id);
    return ctx.json(0, 'ok', res);
  }

  // 创建买赠活动
  async create(ctx) {
    const kdtId = ctx.kdtId;
    const saveCommand = ctx.request.body;
    const res = await new BuyGiveFacade(ctx).create(kdtId, saveCommand);
    return ctx.json(0, 'ok', res);
  }

  // 更新买赠活动
  async update(ctx) {
    const kdtId = ctx.kdtId;
    const editCommand = ctx.request.body;
    const res = await new BuyGiveFacade(ctx).update(kdtId, editCommand);
    return ctx.json(0, 'ok', res);
  }

  // 失效买赠活动
  async invalid(ctx) {
    const kdtId = ctx.kdtId;
    const operator = this.formatOperator;
    const { id } = ctx.request.body;
    const res = await new BuyGiveFacade(ctx).invalid(kdtId, id, operator.userId);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = FreebieController;
