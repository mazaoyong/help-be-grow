const BaseService = require('../../../base/BaseService');

class AssetsAdapterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.assets.AssetsAdapterFacade';
  }

  // 开通商户号
  async getAccountBusinessNumber(params) {
    const result = await this.owlInvoke('getAccountBusinessNumber', [params]);

    return result;
  }
}

module.exports = AssetsAdapterService;
