const BaseService = require('../base/BaseService');

/** com.youzan.ump.manage.api.GoodsImportService -  */
class GoodsImportService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.manage.api.GoodsImportService';
  }

  /**
   *  文件导入
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/617615
   *
   *  @param {Object} param -
   *  @param {number} param.kdtId - 店铺id
   *  @param {number} param.alreadyChosen - 已经选择多少件
   *  @param {string} param.sourceUrl - 源文件地址
   *  @param {number} param.activityId - 活动id
   *  @param {number} param.appType - 活动类型
   *  @param {string} param.name - 导入文件名称
   *  @param {number} param.operatorId - 操作员id
   *  @param {string} param.snapshot - 操作快照(可能包含操作人姓名,活动名称等)
   *  @return {Promise}
   */
  async fileImport(param) {
    return this.invoke('fileImport', [param]);
  }

  /**
   *  文件结果查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/617616
   *
   *  @param {Object} param -
   *  @param {number} param.kdtId - 店铺id
   *  @param {number} param.id -
   *  @return {Promise}
   */
  async getResult(param) {
    return this.invoke('getResult', [param]);
  }

  /**
   *  文件列表页
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/617617
   *
   *  @param {Object} param -
   *  @param {number} param.kdtId - 店铺id
   *  @param {number} param.pageSize - 每页数量
   *  @param {number} param.appType - 活动类型
   *  @param {number} param.pageNo - 页码
   *  @return {Promise}
   */
  async findFileLists(param) {
    return this.invoke('findFileLists', [param]);
  }

  /**
   *  取消导入
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/664971
   *
   *  @param {Object} param -
   *  @param {number} param.id -
   *  @return {Promise}
   */
  async cancelImport(param) {
    return this.invoke('cancelImport', [param]);
  }

  /**
   *  导入完成确认
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/673309
   *
   *  @param {Object} param -
   *  @param {number} param.kdtId - 店铺id
   *  @param {number} param.id -
   *  @return {Promise}
   */
  async importSure(param) {
    return this.invoke('importSure', [param]);
  }
}

module.exports = GoodsImportService;
