const BaseController = require('../../base/BaseController');
const { checkEduWktStore } = require('@youzan/utils-shop');
const URL = require('@youzan/wsc-pc-base/app/lib/URL');

/**
 * @class CourseProductFacadeController
 * @extends {BaseController}
 */
class CourseProductController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByKeys(this.ctx, {
        namespaceId: 'shop',
        businessId: 'wsc-pc-shop',
      });
    }
  }

  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );

    // 根据 kdtId 获取公众号详情
    // const mpAccount = await new MpAccountService(ctx).getMpAccount(ctx.kdtId);

    ctx.setGlobal('lifecycle', lifecycle); // 店铺生命周期

    // 商业化版本控制逻辑: 若微课堂版本进入线下课管理，重定向到专栏管理页面
    if (checkEduWktStore(ctx.getState('shopInfo'))) {
      return ctx.redirect(URL.site('/vis/course/column/list', 'v4'));
    }

    await ctx.render('course/course/index.html');
  }
}

module.exports = CourseProductController;
