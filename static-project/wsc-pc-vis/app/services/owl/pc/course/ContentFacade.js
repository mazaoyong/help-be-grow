const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.course.ContentFacade -  */class ContentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.course.ContentFacade';
  }

  /**
   *  快捷修改内容商品规格相关信息 (标题和价格)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/475628
   *
   *  @param {number} kdtId -
   *  @param {Object} columnQuickUpdateCommand -
   *  @param {number} columnQuickUpdateCommand.price - 价格
   *  @param {string} columnQuickUpdateCommand.title - 标题
   *  @param {Object} columnQuickUpdateCommand.operator -
   *  @param {string} columnQuickUpdateCommand.productAlias - 商品alias
   *  @return {Promise}
   */
  async quickUpdateContentByAlias(kdtId, contentQuickUpdateCommand) {
    return this.invoke('quickUpdateContentByAlias', [
      kdtId,
      contentQuickUpdateCommand,
    ]);
  }

  /**
   *  获取内容订阅数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/506683
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getContentSubscriptionCount(kdtId, alias) {
    return this.invoke('getContentSubscriptionCount', [kdtId, alias]);
  }

  /**
   *  批量获取内容订阅数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1030776
   *
   *  @param {number} kdtId -
   *  @param {Array} aliases -
   *  @return {Promise}
   */
  async findContentSubscriptionCountList(kdtId, aliases) {
    return this.invoke('findContentSubscriptionCountList', [kdtId, aliases]);
  }
}

module.exports = ContentFacade;
