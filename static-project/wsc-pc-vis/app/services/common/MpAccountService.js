const BaseService = require('../base/BaseService');

class MpAccountService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.channels.service.MpAccountService';
  }

  /**
   * 根据 kdtId 获取公众号详情
   *
   * @param {string|number} kdtId
   * @doc https://doc.qima-inc.com/pages/viewpage.action?pageId=27934583
   */
  async getMpAccount(kdtId) {
    let resupt = await this.invoke('getMpAccountByKdtId', [kdtId]);
    return resupt;
  }
}

module.exports = MpAccountService;
