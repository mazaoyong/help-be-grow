const BaseService = require('../base/BaseService');

class ShopTaskApiService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.sop.api.service.ShopTaskApiService';
  }

  // 完成任务
  async finishTask(kdtId, checkMethodCode) {
    let result = await this.invoke('finishTask', [{
      kdtId, checkMethodCode,
    }]);
    return result;
  }
}

module.exports = ShopTaskApiService;
