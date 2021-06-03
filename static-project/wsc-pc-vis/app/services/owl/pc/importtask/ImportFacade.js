const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.importtask.ImportFacade -  */
class ImportFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.importtask.ImportFacade';
  }

  /**
  *  创建导入任务
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/428095
  *
  *  @param {number} kdtId - 店铺Id
  *  @param {Object} command - command
  *  @param {string} command.kdtName - 校区名称
  *  @param {number} command.importType - 导入类型 com.youzan.owl.oc.api.importtask.enums.ImportTypeEnums
  *  @param {Object} command.importFile - 导入线索文件信息，包含url
  *  @param {Object} command.operator - 本次导入任务的创建者
  *  @return {Promise}
  */
  async createImportTask(kdtId, command) {
    return this.invoke('createImportTask', [kdtId, command]);
  }

  /**
   *  获取导入记录(刷新)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/428097
   *
   *  @param {number} kdtId - 店铺Id
   *  @param {number} taskId - 任务id
   *  @return {Promise}
   */
  async getImportTask(kdtId, taskId) {
    return this.invoke('getImportTask', [kdtId, taskId]);
  }
}

module.exports = ImportFacade;
