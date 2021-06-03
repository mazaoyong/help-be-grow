const BaseController = require('../../base/BaseNewController');

class RenderController extends BaseController {
  // 打卡介绍页
  async renderIntroductionHtml(ctx) {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    this.setSpm('pci', 0);
    await this.setPointsName();
    await ctx.render('supv/punch/introduction.html', { title: '打卡介绍页' });
  }

  // 打卡页
  async renderEditHtml(ctx) {
    await this.baseAcl();
    await ctx.render('supv/punch/edit.html', { title: '打卡页' });
  }

  // 打卡详情页（打卡任务+打卡列表信息）
  async getPunchTaskIndex(ctx) {
    await this.baseAcl();
    await this.setPointsName();
    this.setSpm('pcc', 0);
    await ctx.render('supv/punch/task', { title: '打卡详情' });
  }
  // 打卡详情页
  async renderDetail(ctx) {
    await this.baseAcl();
    await ctx.render('supv/punch/detail', { title: '打卡详情' });
  }
  // 我的打卡
  async renderRank(ctx) {
    await this.baseAcl();
    await this.setPointsName();
    await ctx.render('supv/punch/rank', { title: '我的打卡' });
  }

  // 打卡区
  async renderList(ctx) {
    await this.baseAcl();
    await ctx.render('supv/punch/list', { title: '打卡区' });
  }
}

module.exports = RenderController;
