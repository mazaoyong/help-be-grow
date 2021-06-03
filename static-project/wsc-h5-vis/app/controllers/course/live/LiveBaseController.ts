import BaseController from '../../base/BaseNewController';

class LiveBaseController extends BaseController {
  // 强制登陆
  public async liveAcl() {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
  }
}

export = LiveBaseController;
