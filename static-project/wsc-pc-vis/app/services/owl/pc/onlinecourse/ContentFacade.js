const BaseService = require('../../../base/BaseService');
/* com.youzan.owl.pc.api.onlinecourse.ContentFacade -  */
class ContentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.ContentFacade';
  }

  /**
             *  商户端-批量删除内容
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1028611
*
             *  @param {number} kdtId -
             *  @param {Object} pcBatchDeleteCommand -
             *  @param {Array.<Object>} pcBatchDeleteCommand.aliasList[] - 商品别名
             *  @param {number} pcBatchDeleteCommand.directoryId - 目录id
 该参数为-1时，删除非目录下的内容
 该参数不为-1时，删除当前目录下的内容，并更新内容统计
             *  @param {string} pcBatchDeleteCommand.columnAlias - 专栏别名
 -1：代表删除非专栏下的课程（内容、直播）
 不为-1：表示删除当前专栏下的课程
             *  @param {boolean} pcBatchDeleteCommand.deleteChannel - 是否删除直播商品对应的保利威频道 true: 删除; false: 不删除
             *  @param {Object} pcBatchDeleteCommand.operator - 操作人信息
             *  @return {Promise}
             */
  async batchDeleteContent(kdtId, pcBatchDeleteCommand) {
    return this.invoke('batchDeleteContent', [kdtId, pcBatchDeleteCommand]);
  }
}

module.exports = ContentFacade;
