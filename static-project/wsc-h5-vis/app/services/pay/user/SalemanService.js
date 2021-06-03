const BaseService = require('../../base/BaseService');
/* youzan.pay.user.api.userinfo.saleman.upgrade.result -  */

class SalemanService extends BaseService {
  async queryUpgradeResult(params) {
    const option = {
      service: 'youzan.pay.user.api.userinfo.saleman.upgrade.result',
      method: 'query',
      version: '1.0.0',
      partnerId: '',
    };
    const dubboData = await this.invokePay(option, params);
    return dubboData;
  }
}

module.exports = SalemanService;
