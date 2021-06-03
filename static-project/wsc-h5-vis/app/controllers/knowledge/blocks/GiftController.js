const KnowledgeBaseController = require('../KnowledgeBaseController');
const GiftShareFacade = require('../../../services/owl/ump/giftshare/GiftShareFacade');

class GiftController extends KnowledgeBaseController {
  /**
   * 送礼支付完和订单查看礼包获取购买礼包详情页
   */
  async getGiftDetail(ctx) {
    const { orderAlias = '' } = ctx.query;
    const kdtId = ctx.kdtId;
    let { fansType = 0, buyerId: userId } = this.buyer;
    const ret = await new GiftShareFacade(ctx).getGiftDetail(kdtId, {
      userId, orderAlias, fansType,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取未领取页面信息
   */
  async getGiftShareContent(ctx) {
    const {
      shareAlias = '',
      alias: productAlias = '',
      channelType = '',
      orderAlias = '',
      giftNo = '',
      giftSign = '',
    } = ctx.query;
    const { buyerId: userId = 0, kdtId } = ctx;
    const ret = await new GiftShareFacade(ctx).getGiftShareContent(kdtId, {
      shareAlias, productAlias, userId, channelType, orderAlias, giftNo, giftSign,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取领取结果
   */
  async receive(ctx) {
    const {
      shareAlias = '',
      alias: productAlias = '',
      channelType = '',
      orderAlias = '',
      giftNo = '',
      giftSign = '',
    } = ctx.query;
    const { kdtId, buyerId: userId } = ctx;
    const { fansType } = this.buyer;
    const clientIp = ctx.firstXff || ctx.ip;
    const ret = await new GiftShareFacade(ctx).receive(kdtId, {
      shareAlias,
      productAlias,
      userId,
      channelType,
      orderAlias,
      giftNo,
      giftSign,
      clientIp,
      fansType,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 礼物领取列表
   */
  async getGiftShareRankInfo(ctx) {
    const {
      shareAlias = '',
      alias: productAlias = '',
      channelType = '',
      orderAlias = '',
      page: pageNum,
      pageSize,
    } = ctx.query;
    const { kdtId, buyerId: userId } = ctx;
    const ret = await new GiftShareFacade(ctx).getGiftShareRankInfo(kdtId, {
      pageNum, pageSize,
    }, {
      shareAlias, productAlias, userId, channelType, orderAlias,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取分享别名
   */
  async getShareAlias(ctx) {
    const {
      alias: productAlias = '',
    } = ctx.query;
    let { fansType = 0 } = this.buyer;
    const { kdtId, buyerId: userId } = ctx;
    const ret = await new GiftShareFacade(ctx).getShareAlias(kdtId, {
      productAlias, userId, fansType,
    });
    ctx.json(0, 'ok', ret);
  }
}

module.exports = GiftController;
