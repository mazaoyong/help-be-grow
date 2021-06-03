const ShopMetaReadOuterService = require('../services/shopcenter/ShopMetaReadOuterService');
const ShopUtils = require('@youzan/utils-shop');

const deliveryUtils = {
  /**
   * 生成物流参数的方法，都需加上operatorKdtId，如果是微商城连锁总部，参数加上headId
   * @param {AstroboyContext} ctx
   * @param {*} params
   */
  async getDeliveryParams(ctx, params) {
    const query = ctx.originQuery;
    const body = ctx.originBody;
    // safe done
    const reqKdtId = Number(body.kdtId || query.kdtId);
    const ctxKdtId = ctx.kdtId;
    const shopMetaInfo = await new ShopMetaReadOuterService(ctx).queryShopMetaInfo(ctxKdtId);
    const isWscHqStore = ShopUtils.checkWscHqStore(shopMetaInfo);
    params = {
      ...params,
      operatorKdtId: ctxKdtId,
    };
    // 当前ctx.kdtId对应的店铺为总部
    if (isWscHqStore && ctxKdtId !== reqKdtId) {
      return {
        ...params,
        headId: ctxKdtId,
      };
    }
    return params;
  },
};

module.exports = deliveryUtils;
