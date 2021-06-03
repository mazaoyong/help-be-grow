import BaseService from '../../../base/BaseService';
import { IGetPlatformOauthDto } from 'definitions/api/uic/acl/OmniChannelService/getPlatformOauthUrl';

class OmniChannelService extends BaseService {
  public readonly SERVICE_NAME = 'com.youzan.uic.acl.api.service.OmniChannelService';

  /**
   * @description 当前渠道需要授权的跳转授权链接获取
   * @link http://zanapi.qima-inc.com/site/service/view/757117
   */
  async getPlatformOauthUrl(getPlatformOauthDto: IGetPlatformOauthDto): Promise<string> {
    return this.invoke('getPlatformOauthUrl', [getPlatformOauthDto]);
  }
}

export = OmniChannelService;
