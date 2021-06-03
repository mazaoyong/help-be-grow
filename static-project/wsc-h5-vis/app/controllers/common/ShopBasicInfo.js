import BaseNewController from '../base/BaseNewController';
const CreditPolicyReadService = require('../../services/scrm/credit/policy/CreditPolicyReadService');
class ShopBasicInfo extends BaseNewController {
  /* 获取自定义积分别名 */
  async getCustomPointName(ctx) {
    const dto = {
      creditDefinitionId: 0,
      kdtId: ctx.kdtId || 0,
    };

    let name = '积分';

    try {
      const list = await new CreditPolicyReadService(ctx).getName(dto);
      ctx.json(0, 'ok', list.name || name);
    } catch (error) {
      ctx.json(0, 'ok', name);
    }
  }

  /* 获取店铺元信息 */
  async getShopMetaInfo(ctx) {
    const { kdtId } = ctx;

    let shopMetaInfo = {};
    try {
      shopMetaInfo = await this.callService('iron-base/shop.ShopMetaReadService', 'getShopMetaInfo', kdtId);
      console.log('getShopMetaInfo', shopMetaInfo);
    } catch (err) {
      ctx.visLogger.warn('获取店铺元信息错误', err);
    }

    ctx.json(0, 'ok', shopMetaInfo);
  }
}

module.exports = ShopBasicInfo;
