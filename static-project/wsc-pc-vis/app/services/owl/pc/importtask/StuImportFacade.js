const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.importtask.StuImportFacade -  */
class StuImportFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.importtask.StuImportFacade';
  }

  /**
   *  查询导入记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/869614
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.importType - 导入类型
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async findByPage(kdtId, query, pageRequest) {
    return this.invoke('findByPage', [kdtId, query, pageRequest]);
  }

  /**
   *  创建导入任务
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/869613
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} command -
   *  @param {number} command.importType - 导入类型
   *  @param {Object} command.importFile - 导入文件
   *  @param {number} command.targetKdtId - 校区店铺id（单店跟上层operatorKdtId是一致的）
   *  @param {Object} command.operator - 操作人信息
   *  @param {string} command.targetKdtName - 校区店铺名称
   *  @return {Promise}
   */
  async create(operatorKdtId, command) {
    return this.invoke('create', [operatorKdtId, command]);
  }

  /**
   *  获取任务校验总览
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/795708
   *
   *  @param {number} kdtId -
   *  @param {number} taskId -
   *  @return {Promise}
   */
  async getValidateSummary(kdtId, taskId) {
    return this.invoke('getValidateSummary', [kdtId, taskId]);
  }

  /**
   *  导入前检查
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/875195
   *
   *  @param {number} kdtId -
   *  @param {number} taskId -
   *  @return {Promise}
   */
  async prepareImport(kdtId, taskId) {
    return this.invoke('prepareImport', [kdtId, taskId]);
  }

  /**
   *  开始导入
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/795706
   *
   *  @param {number} kdtId -
   *  @param {number} taskId -
   *  @return {Promise}
   */
  async submitImport(kdtId, taskId) {
    return this.invoke('submitImport', [kdtId, taskId]);
  }

  /**
   *  获取任务阶段性进度(校验中 OR 导入中)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/872624
   *
   *  @param {number} kdtId -
   *  @param {Array} query -
   *  @return {Promise}
   */
  async findTaskProgress(kdtId, query) {
    return this.invoke('findTaskProgress', [kdtId, query]);
  }

  /**
   *  获取单个导入任务详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/807519
   *
   *  @param {number} kdtId -
   *  @param {number} taskId -
   *  @return {Promise}
   */
  async getByTaskId(kdtId, taskId) {
    return this.invoke('getByTaskId', [kdtId, taskId]);
  }

  /**
   *  重新导入错误的数据行
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/869619
   *
   *  @param {number} kdtId -
   *  @param {number} taskId -
   *  @return {Promise}
   */
  async prepareReimport(kdtId, taskId) {
    return this.invoke('prepareReimport', [kdtId, taskId]);
  }

  /**
   *  获取错误任务行校验
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/886152
   *
   *  @param {number} kdtId -
   *  @param {Array} taskIds -
   *  @return {Promise}
   */
  async listRowFieldErrorSummary(kdtId, taskIds) {
    return this.invoke('listRowFieldErrorSummary', [kdtId, taskIds]);
  }

  /**
   *  获取导入模板
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1043128
   *
   *  @param {number} kdtId - kdtId
   *  @param {Object} query - query
   *  @param {number} query.templateType - 导入模板类型
   *  @param {number} query.kdtId - 校区店铺ID
   *  @return {Promise}
   */
  async getTemplate(kdtId, query) {
    return this.invoke('getTemplate', [kdtId, query]);
  }

  /**
   *  获取表头
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1043508
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.templateType - 导入模板类型
   *  @param {number} query.kdtId - 校区店铺ID
   *  @return {Promise}
   */
  async getHeader(kdtId, query) {
    return this.invoke('getHeader', [kdtId, query]);
  }

  /**
   *  获取特殊的表头
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1062119
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 参数
   *  @param {number} query.templateType - 导入模板类型 0 学员导入 1 线索
   *  @param {number} query.kdtId - 校区店铺ID（单店的是和目标保持一致，校区的时候）
   *  @return {Promise}
   */
  async getSpecifiedHeader(kdtId, query) {
    return this.invoke('getSpecifiedHeader', [kdtId, query]);
  }

  /**
   *  模板检测接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1043559
   *
   *  @param {number} kdtId - kdtId
   *  @param {Object} query - query
   *  @param {number} query.templateType - 导入模板类型
   *  @param {number} query.kdtId - 校区店铺ID
   *  @param {number} query.taskId - 任务ID
   *  @return {Promise}
   */
  async templateCheck(kdtId, query) {
    return this.invoke('templateCheck', [kdtId, query]);
  }

  /**
   *  通过任务ID检测模板是否变更 如果没有错误代码直接返回 返回true表示没有改动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1058221
   *
   *  @param {number} kdtId - kdtId
   *  @param {number} taskId - taskId
   *  @return {Promise}
   */
  async templateCheckByTaskId(kdtId, taskId) {
    return this.invoke('templateCheckByTaskId', [kdtId, taskId]);
  }

  /**
   *  重新校验数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1062500
   *
   *  @param {number} kdtId - kdtId
   *  @param {number} taskId - taskId
   *  @return {Promise}
   */
  async againValidate(kdtId, taskId) {
    return this.invoke('againValidate', [kdtId, taskId]);
  }
}

module.exports = StuImportFacade;
