const BaseService = require('../../../base/BaseService');

class EduAssetFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.asset.EduAssetFacade';
  }

  /**
   * @description 调班时查询课程资产信息
   * @link http://zanapi.qima-inc.com/site/service/view/951146
   */
  async getAssetClassUpdateInfo(kdtId, query) {
    return this.invoke('getAssetClassUpdateInfo', [kdtId, query]);
  }
}

module.exports = EduAssetFacade;
