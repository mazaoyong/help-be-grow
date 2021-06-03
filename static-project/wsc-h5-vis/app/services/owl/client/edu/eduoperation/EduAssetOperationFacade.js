const BaseService = require('../../../../base/BaseService');

class EduAssetOperationFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.asset.EduAssetOperationFacade';
  }

  /**
   *  课程资产变更明细
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/942892
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.assetNo - 资产编号
   *  @param {number} query.kdtId - 店铺id
   *  @param {number} query.studentId - 学员id
   *  @param {number} query.operationOriginType - 查看操作来源
   *  @param {Object} page -
   *  @param {number} page.pageNumber -
   *  @param {boolean} page.countEnabled - 是否开启count，默认为开启
   *  @param {number} page.pageSize -
   *  @param {Object} page.sort -
   *  @return {Promise}
   */
  async queryAssetOperationPage(kdtId, query, page) {
    return this.invoke('queryAssetOperationPage', [
      kdtId,
      page,
      query,
    ]);
  }
}

module.exports = EduAssetOperationFacade;
