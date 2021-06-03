import BaseService from '../../base/BaseService';
class AppConfigRemoteService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.bifrost.service.api.service.AppShopRemoteService';
  }

  /**
   *  根据clicnetId 获取三方app 信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/476178
   *
   *  @param {String} clientId
   */
  async getAppShopBasicInfo(clientId: string) {
    return this.invoke('getAppShopBasicInfo', [clientId]);
  }
}

export = AppConfigRemoteService;
