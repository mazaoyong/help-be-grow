const BaseController = require('../../base/BaseController');
const RefundFacade = require('../../../services/owl/pc/refund/RefundFacade');
const BuyGivePresentFacade = require('../../../services/owl/pc/buygive/BuyGivePresentFacade');

class RefundController extends BaseController {
  // 首页
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );

    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    ctx.setGlobal('lifecycle', lifecycle); // 店铺生命周期

    return ctx.render('recruit/refund/index.html');
  }

  async getPreRefundFromOrder(ctx) {
    const {
      preRefundCommand,
    } = ctx.getQueryParse();
    const data = await new RefundFacade(ctx).preRefundFromOrderV2(ctx.kdtId, preRefundCommand);
    return ctx.json(0, 'ok', data);
  }

  async getPreRefundFromUser(ctx) {
    const {
      preRefundCommand,
    } = ctx.getQueryParse();
    const data = await new RefundFacade(ctx).preRefundFromUserV2(ctx.kdtId, preRefundCommand);
    return ctx.json(0, 'ok', data);
  }

  async refund(ctx) {
    const {
      refundCommand,
    } = ctx.request.body || {};
    const data = await new RefundFacade(ctx).refundV2(ctx.kdtId, refundCommand);
    return ctx.json(0, 'ok', data);
  }

  async findBuyGivePresentPageByCondition(ctx) {
    const kdtId = ctx.kdtId;
    const { query, pageRequest } = ctx.getQueryParse();
    const data = await new BuyGivePresentFacade(ctx).findPageByCondition(kdtId, query, pageRequest);
    return ctx.json(0, 'ok', data);
  }

  async queryAssetRefundPhasePriceInfo(ctx) {
    const { userId } = this.formatOperator;
    let { assetNo, refundFee, kdtId } = ctx.getQueryParse();
    kdtId = kdtId || ctx.kdtId;
    const params = {
      refundFee: Number(refundFee) || 0,
      assetNo,
      userId,
    };
    const data = await new RefundFacade(ctx).queryAssetRefundPhasePriceInfo(kdtId, params);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = RefundController;
