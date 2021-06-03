const BaseService = require('../base/BaseService');

class DataCenterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.bigdata.datacenter.base.api.service.ump.UmpTeamService';
  }

  async getEffectData(req) {
    const result = await this.invoke('getOfflineStat', [req]);
    return result;
  }
}

module.exports = DataCenterService;
