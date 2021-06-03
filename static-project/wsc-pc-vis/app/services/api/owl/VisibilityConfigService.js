const BaseService = require('../../base/BaseService');

/**
 * 信息隐藏相关接口
 */
class VisibilityConfigService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.VisibilityConfigService';
  }

  /**
   * 全局店铺设置(首次)
   *
   * @param {Object} req
   */
  async createKdtVisibilityConfig(req) {
    const result = await this.invoke('createKdtVisibilityConfig', [req]);
    return result;
  }
}

module.exports = VisibilityConfigService;
