const BaseController = require('../base/BaseController');

class IndexController extends BaseController {
  /**
   * 发布点评
   */
  async getIndexHtml(ctx) {
    await ctx.render('h5/post-edit.html');
  }

  /**
   * 海报分享页
   */
  async getPosterHtml(ctx) {
    await ctx.render('h5/moments-poster.html');
  }

  /**
   * 家校圈feed流
   */
  async getFeedsIndexHtml(ctx) {
    await ctx.render('h5/feeds.html');
  }

  /**
   * 动态详情
   */
  async getFeedsDetailIndexHtml(ctx) {
    await ctx.render('h5/feed-detail.html');
  }

  /**
   * 消息盒子
   */
  async getMessageBoxIndexHtml(ctx) {
    await ctx.render('h5/message-box.html');
  }

  /**
   * 时光轴
   */
  async getTimelineHtml(ctx) {
    await ctx.render('h5/timeline.html', { title: '\u200E' });
  }
}

module.exports = IndexController;
