import BaseService from '../../base/BaseService';

/**
 * 用户手机服务相关接口
 * @see http://zanapi.qima-inc.com/site/search?q=com.youzan.uic.auth.api.service.MobileUserService
 */
class MobileUserService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.uic.auth.api.service.MobileUserService';
  }

  /**
   * 第三方账号迁移数据用户登录补全弹框相关接口
   * 调用后端接口check是否需要弹窗
   *
   * @returns {Promise<object>}
   * @see http://zanapi.qima-inc.com/site/service/view/283766
   * @owner 孟嘉硕
   */
  async checkNeedExternalLogin() {
    const { kdtId, sessionId } = this.ctx;
    return this.invoke('checkNeedExternalLogin', [
      {
        kdtId,
        sessionId,
      },
      {
        ipAddress: this.ctx.firstXff,
        userAgent: this.ctx.userAgent,
      },
    ]);
  }
}

export = MobileUserService;
