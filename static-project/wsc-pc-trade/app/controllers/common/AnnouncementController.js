const CommonController = require('./CommonController');
const { appName } = require('../../constants');

class AnnouncementController extends CommonController {
  /**
   * 获取 apollo 配置的公告内容
   *
   * @param {Context} ctx
   * @memberof AnnouncementController
   */
  async getApolloAnnouncement(ctx) {
    const name = ctx.getQueryData('name');
    const content = await ctx.apolloClient.getConfig({
      appId: appName,
      namespace: 'announcement',
      key: name,
    });
    ctx.successRes(content);
  }
}

module.exports = AnnouncementController;
