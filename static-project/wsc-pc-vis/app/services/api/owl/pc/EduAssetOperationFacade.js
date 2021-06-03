const BaseService = require('../../../base/BaseService');

class EduAssetOperationFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.asset.EduAssetOperationFacade';
  }

  /**
   * @description 查询资产操作明细简要信息
   * @link http://zanapi.qima-inc.com/site/service/view/942769
   */
  async queryAssetOperationBriefInfo(kdtId, query) {
    return this.invoke('queryAssetOperationBriefInfo', [kdtId, query]);
  }

  /**
   * @description 分页查询资产操作明细
   * @link http://zanapi.qima-inc.com/site/service/view/942770
   */
  async queryAssetOperationPage(kdtId, page, query) {
    return this.invoke('queryAssetOperationPage', [kdtId, page, query]);
  }

  /**
   * 分页查询资产手动扣减操作明细
   * @link http://zanapi.qima-inc.com/site/service/view/1014057
   * @param {number} kdtId -
   * @param {Object} page - 分页请求
   * @param {number} page.pageNumber -
   * @param {number} page.pageSize -
   * @param {Object} page.sort -
   * @param {Object} query - undefined
   * @return {Promise}
   */
  async queryAssetSubOperationPage(kdtId, page, query) {
    return this.invoke('queryAssetSubOperationPage', [kdtId, page, query]);
  }

  /**
   * 资产手动扣减操作导出请求
   * @link http://zanapi.qima-inc.com/site/service/view/1015138
   * @param {number} kdtId -
   * @param {Object} query - undefined
   * @return {Promise}
   */
  async submitAssetSubOperationExportTask(kdtId, query) {
    return this.invoke('submitAssetSubOperationExportTask', [kdtId, query]);
  }

  /**
   * 查询资产手动扣减操作简要信息
   * @link http://zanapi.qima-inc.com/site/service/view/1015047
   * @param {number} kdtId -
   * @param {Object} query -
   * @param {number} query.studentId - 学员id
   * @param {string} query.lessonEndTime - 结束时间
   * @param {number} query.kdtId - 店铺id
   * @param {string} query.assetNo - 资产编号
   * @param {string} query.lessonStartTime - 开始时间
   * @return {Promise}
   */
  async queryAssetSubOperationBriefInfo(kdtId, query) {
    return this.invoke('queryAssetSubOperationBriefInfo', [kdtId, query]);
  }
}

module.exports = EduAssetOperationFacade;
