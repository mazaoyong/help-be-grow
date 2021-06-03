const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.onlinecourse.ColumnFacade -  */
class ColumnFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.ColumnFacade';
  }

  /**
   *  更新专栏下内容/直播序号
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511085
   *
   *  @param {number} kdtId -
   *  @param {Object} pcSerialNoCommand -
   *  @param {number} pcSerialNoCommand.owlType - 更新专栏下内容/直播序号时需要
   *  @param {string} pcSerialNoCommand.alias - 商品别名
   *  @param {Object} pcSerialNoCommand.operator - 操作人信息
   *  @param {number} pcSerialNoCommand.serialNo - 排序值
   *  @return {Promise}
   */
  async updateContentSerialNo(kdtId, pcSerialNoCommand) {
    return this.invoke('updateContentSerialNo', [kdtId, pcSerialNoCommand]);
  }

  /**
   *  专栏管理，批量添加内容/直播
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511137
   *
   *  @param {number} kdtId -
   *  @param {Object} addContentCommand -
   *  @param {string} addContentCommand.columnAlias -
   *  @param {Array.<Object>} addContentCommand.addedContentDTOS[] - 知识列表 包括内容/直播
   *  @param {Object} addContentCommand.operator -
   *  @return {Promise}
   */
  async batchAddContent2Column(kdtId, addContentCommand) {
    return this.invoke('batchAddContent2Column', [kdtId, addContentCommand]);
  }
}

module.exports = ColumnFacade;
