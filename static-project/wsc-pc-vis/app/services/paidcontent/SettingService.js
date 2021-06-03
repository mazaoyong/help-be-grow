const BaseService = require('../base/BaseService');

class PosterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.facade.OperationSwitchFacade';
  }

  // 获取设置列表
  async lists(req) {
    const result = await this.invoke('findPageListByKdtId', [req]);
    return result;
  }

  // 设置开关
  async update(req) {
    const result = await this.invoke('saveSwitch', [req]);
    return result;
  }
}

module.exports = PosterService;
