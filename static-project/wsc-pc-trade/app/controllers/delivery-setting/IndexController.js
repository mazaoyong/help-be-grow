const DeliverySettingBaseController = require('./DeliverySettingBaseController');
const DeliverySettingService = require('../../services/delivery/DeliverySettingService');
const ShopChainSearchService = require('../../services/shopcenter/ShopChainSearchService');
const _get = require('lodash/get');

class IndexController extends DeliverySettingBaseController {
  /**
   * @param {AstroboyContext} ctx
   */
  async getIndexHtml(ctx) {
    await this.initWeappStatusInfo();
    await this.initWeappVersion();
    const templateType = 1;
    ctx.setEnv({ templateType });
    await ctx.render('delivery-setting/index.html');
  }
  /**
   * 微商城连锁-总部-配送设置-网店配置-获取网店配送方式列表
   * @param {AstroboyContext} ctx
   */
  async fetchStoreDeliveryList(ctx) {
    const { kdtId, userId } = ctx;
    const { page, pageSize } = ctx.getRequestData();
    const result = await new ShopChainSearchService(ctx).searchDescendentShop({
      adminId: userId,
      hqKdtId: kdtId,
      pageNum: page,
      pageSize,
      realTimeMode: false,
    });
    const paginator = {
      totalCount: result.total,
      pageSize: result.pageSize,
      page: result.pageNum,
    };
    const data = _get(result, 'data', []);
    const items = data.map(item => {
      const province = _get(item, 'address.province', '');
      const city = _get(item, 'address.city', '');
      const county = _get(item, 'address.county', '');
      const address = _get(item, 'address.address', '');
      return {
        id: item.kdtId,
        name: item.shopName,
        address: province + city + county + address,
      };
    });
    const kdtIds = items.map(item => item.id);
    if (kdtIds && kdtIds.length > 0) {
      const settings = await new DeliverySettingService(ctx).getSettings({
        kdtIds,
        fromApp: 'wsc',
        requestId: this.requestId,
      });
      items.forEach(item => {
        const setting = settings[item.id];
        item.isSelf = setting.isSelf;
        item.isLocal = setting.isLocal;
        item.isExpress = setting.isExpress;
      });
      ctx.successRes({
        paginator,
        items,
      });
    } else {
      ctx.successRes({
        paginator,
        items: [],
      });
    }
  }
}

module.exports = IndexController;
