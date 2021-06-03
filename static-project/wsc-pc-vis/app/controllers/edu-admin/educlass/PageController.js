const BaseController = require('../../base/BaseController');

class PageController extends BaseController {
  async init() {
    await super.init();
    await this.initBdappInfo(this.ctx).catch(e => console.error(e));

    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByNamespace(this.ctx, {
        namespaceId: 'courseAssert',
        businessId: 'wsc-pc-vis',
      });
      await this.ctx.getAbilitiesByMultiNamespaceV2(
        this.ctx,
        [
          { businessName: 'edu', namespaceName: '督学互动', abilityKey: ['editHomework', 'viewHomework', 'createHomework'] },
        ],
        { shopInfo: this.ctx.getState('shopInfo') }
      );

      await this.checkHomeworkWhiteList(this.ctx);
    };
  }

  async checkHomeworkWhiteList(ctx) {
    const prevWhiteList = this.ctx.getState('whitelist', {});
    const homeworkEnabled = await this.checkInWhiteList(ctx, 'edu_homework');

    const newWhiteList = { ...prevWhiteList, homework: homeworkEnabled };
    this.ctx.setState('whitelist', newWhiteList);
    this.ctx.setGlobal('whitelist', newWhiteList);
  }

  async getIndexHtml(ctx) {
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await ctx.render('edu-admin/educlass/index.html');
  }
}

module.exports = PageController;
