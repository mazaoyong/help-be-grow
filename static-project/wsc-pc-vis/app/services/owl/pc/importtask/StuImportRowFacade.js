const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.importtask.StuImportRowFacade -  */
class StuImportRowFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.importtask.StuImportRowFacade';
  }

  /**
   *  分页查询行
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/869620
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.rowFieldValidateFlag - 行字段校验标
   *  @param {number} query.rowValidateFlag - 行校验标
   *  @param {Array.<Array>} query.rowIds[] - 行id
   *  @param {Array.<Array>} query.dataSignCodes[] - 行数据标识
   *  @param {Array.<Array>} query.rowStates[] - 行状态
   *  @param {number} query.taskId - 任务 id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findRowsByPage(kdtId, query, pageRequest) {
    return this.invoke('findRowsByPage', [kdtId, query, pageRequest]);
  }

  /**
   *  分页查询行(脱敏)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/884102
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.rowFieldValidateFlag - 行字段校验标
   *  @param {number} query.rowValidateFlag - 行校验标
   *  @param {Array.<Array>} query.rowIds[] - 行id
   *  @param {Array.<Array>} query.dataSignCodes[] - 行数据标识
   *  @param {Array.<Array>} query.rowStates[] - 行状态
   *  @param {number} query.taskId - 任务 id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findRowsDesensitizeByPage(kdtId, query, pageRequest) {
    return this.invoke('findRowsDesensitizeByPage', [kdtId, query, pageRequest]);
  }

  /**
   *  获取任务行
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/869621
   *
   *  @param {number} kdtId -
   *  @param {number} taskId -
   *  @param {number} rowId -
   *  @return {Promise}
   */
  async getRowById(kdtId, taskId, rowId) {
    return this.invoke('getRowById', [kdtId, taskId, rowId]);
  }

  /**
   *  保存任务行
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/869622
   *
   *  @param {number} kdtId -
   *  @param {Object} saveCommand -
   *  @param {Array.<Object>} saveCommand.rowFields[] - 行字段数据
   *  @param {number} saveCommand.taskId - 任务 id
   *  @param {Object} saveCommand.operator - 操作人
   *  @param {number} saveCommand.rowId - 行id
   *  @return {Promise}
   */
  async saveRow(kdtId, saveCommand) {
    return this.invoke('saveRow', [kdtId, saveCommand]);
  }

  /**
   *  批量修改列字段
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/869623
   *
   *  @param {number} kdtId -
   *  @param {Object} updateCommand -
   *  @param {string} updateCommand.fieldName -
   *  @param {Array.<Array>} updateCommand.rowIds[] -
   *  @param {string} updateCommand.value -
   *  @param {number} updateCommand.taskId -
   *  @param {Object} updateCommand.operator -
   *  @return {Promise}
   */
  async batchUpdateFields(kdtId, updateCommand) {
    return this.invoke('batchUpdateFields', [kdtId, updateCommand]);
  }

  /**
   *  批量删除任务导入行
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/869624
   *
   *  @param {number} kdtId -
   *  @param {Object} deleteRowsCommand -
   *  @param {Array.<Array>} deleteRowsCommand.rowIds[] -
   *  @param {number} deleteRowsCommand.taskId -
   *  @param {Object} deleteRowsCommand.operator -
   *  @return {Promise}
   */
  async batchDeleteRows(kdtId, deleteRowsCommand) {
    return this.invoke('batchDeleteRows', [kdtId, deleteRowsCommand]);
  }

  // 查询重复数据行（不分页)
  async findSameRows(kdtId, query) {
    return this.invoke('findSameRows', [kdtId, query]);
  }

  // 查询冲突数据（不分页)
  async getSameData(kdtId, query) {
    return this.invoke('getSameData', [kdtId, query]);
  }
}

module.exports = StuImportRowFacade;
