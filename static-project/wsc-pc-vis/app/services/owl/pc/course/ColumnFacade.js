const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.course.ColumnFacade -  */class ColumnFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.course.ColumnFacade';
  }

  /**
   *  快捷修改专栏商品规格相关信息 (标题和价格)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/475629
   *
   *  @param {number} kdtId -
   *  @param {Object} columnQuickUpdateCommand -
   *  @param {number} columnQuickUpdateCommand.price - 价格
   *  @param {string} columnQuickUpdateCommand.title - 标题
   *  @param {Object} columnQuickUpdateCommand.operator -
   *  @param {string} columnQuickUpdateCommand.productAlias - 商品alias
   *  @return {Promise}
   */
  async quickUpdateColumnByAlias(kdtId, columnQuickUpdateCommand) {
    return this.invoke('quickUpdateColumnByAlias', [
      kdtId,
      columnQuickUpdateCommand,
    ]);
  }
}

module.exports = ColumnFacade;