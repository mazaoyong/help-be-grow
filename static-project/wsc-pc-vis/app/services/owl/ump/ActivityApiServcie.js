const BaseService = require('../../base/BaseService');

/**
 * 信息隐藏相关接口
 */
class VisibilityConfigService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.ActivityApiService';
  }

  /**
   * @param {*} kdtId
   * @param {*} pageIndex
   * @param {*} pageSize
   * @param {*} goodsType
   * @param {*} activityType
   * @param {*} activityId
   */
  async getGoodsList(kdtId, pageIndex, pageSize, goodsType, activityType, activityId) {
    const result = await this.invoke('listGoodsByType', [
      { kdtId, pageIndex, pageSize, goodsType, activityType, activityId },
    ]);
    return result;
  }
}

module.exports = VisibilityConfigService;
