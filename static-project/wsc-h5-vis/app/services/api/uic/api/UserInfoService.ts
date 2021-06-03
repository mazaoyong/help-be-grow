import BaseService from '../../../base/BaseService';
import {
  IGetPlatformUserInfoByFansIdParam,
  IWechatUserInfoModel,
} from 'definitions/api/uic/api/UserInfoService/getPlatformUserInfoByFansId';

class UserInfoService extends BaseService {
  public readonly SERVICE_NAME = 'com.youzan.uic.api.user.service.UserInfoService';

  /**
   * @description 根据粉丝id查询平台帐号（粉丝）信息，支持全部粉丝类型（包含自有粉丝）
   * @link http://zanapi.qima-inc.com/site/service/view/103617
   */
  async getPlatformUserInfoByFansId(param: IGetPlatformUserInfoByFansIdParam): Promise<IWechatUserInfoModel> {
    return this.invoke('getPlatformUserInfoByFansId', [param]);
  }
}

export = UserInfoService;
