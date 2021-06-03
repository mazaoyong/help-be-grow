const BaseService = require('../../../base/BaseService');

class AssetFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.asset.AssetFacade';
  }

  /**
   * @description 修改课时时查询课程资产信息
   * @link http://zanapi.qima-inc.com/site/service/view/949497
   */
  async getAssetCourseTimeUpdateInfo(kdtId, query) {
    return this.invoke('getAssetCourseTimeUpdateInfo', [kdtId, query]);
  }

  /**
  *  获取用户资产信息
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/961793
  *
  *  @param {number} operatorKdtId - 店铺Id
  *  @param {string} asset.assetNo - 资产id
  *  @param {number} asset.studentId - 学员id
  *
  */
  async getStuAssetInfo(operatorKdtId, asset) {
    return this.invoke('getStuAssetInfo', [operatorKdtId, asset]);
  }
}

module.exports = AssetFacade;
