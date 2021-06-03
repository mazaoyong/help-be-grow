const BaseController = require('../base/BaseController');
const SalesmanEntryType = require('./SalesmanEntryType');
const LiveVideoFacade = require('../../services/api/owl/pc/LiveVideoFacade');

class TabsController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByMultiNamespace(this.ctx, [
        {
          namespaceId: 'course',
          businessId: 'wsc-pc-vis',
        },
      ]);
    }
  }

  async getIndexHtml(ctx) {
    // await this.pageInit(ctx);

    // 判断知识付费中营销下显示分销员入口还是销售员入口
    const salesmanEntryType = await new SalesmanEntryType(ctx).getType(ctx).catch(() => {});
    await this._setPolyvAuth(ctx).catch(() => {});

    ctx.setGlobal({
      salesmanEntryType,
    });

    await ctx.render('paidcontent/tabs/index.html');
  }

  // 检查保利威是否授权，未授权不再展示保利威入口
  async _setPolyvAuth(ctx) {
    const { kdtId } = ctx;
    const result = await new LiveVideoFacade(ctx).polyvCheck(kdtId);
    if (!result.checked && result.failCode === 1) {
      return ctx.setGlobal('showPolvy', false);
    }
    ctx.setGlobal('showPolvy', true);
  }
}

module.exports = TabsController;
