const BaseService = require('../../../base/BaseService');

class CreditPolicyReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.credit.policy.CreditPolicyReadService';
  }

  // 获取自定义积分名称
  async getName(params) {
    const result = await this.owlInvoke('getName', [params], { cache: 15 });

    return result;
  }
}

module.exports = CreditPolicyReadService;
