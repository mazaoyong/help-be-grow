const BaseService = require('../../base/BaseService');
/**
 */
class MobileUserService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.uic.auth.api.service.MobileUserService';
  }

  /**
   *  密码登录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/112531
   *
   *  @param {Object} mobileUser -
   *  @param {string} mobileUser.countryCode - +86(城市code)
   *  @param {string} mobileUser.mobile - 手机
   *  @param {string} mobileUser.password - 密码
   *  @param {Object} scene - 设备信息
   */
  async loginByPassword(mobileUser = {}, scene = {}) {
    return this.invoke('loginByPassword', [mobileUser, scene]);
  }

  /**
   *  验证码登录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/112533
   *
   *  @param {Object} mobileUser -
   *  @param {string} mobileUser.countryCode - +86(城市code)
   *  @param {string} mobileUser.mobile - 手机
   *  @param {string} mobileUser.smsCaptcha - 验证码
   *  @param {Object} scene - 设备信息
   */
  async loginBySmsCaptcha(mobileUser = {}, scene = {}) {
    return this.invoke('loginBySmsCaptcha', [mobileUser, scene]);
  }

  /**
   *  退出登录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/284977
   *
   *  @param {Object} mobileUser -
   *  @param {string} mobileUser.countryCode - +86(城市code)
   *  @param {string} mobileUser.mobile - 手机
   *  @param {Object} scene -
   */
  async logout(mobileUser = {}, scene = {}) {
    return this.invoke('logout', [{ mobileUser, scene }]);
  }

  /**
   *  获取验证码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/111515
   *
   *  @param {Object} mobileUser -
   *  @param {string} mobileUser.countryCode - +86(城市code)
   *  @param {string} mobileUser.mobile - 手机
   *  @param {Object} scene - 设备信息
   */
  async sendSmsCaptchaForLogin(mobileUser = {}, scene = {}) {
    return this.invoke('sendSmsCaptchaForLogin', [mobileUser, scene]);
  }
}

module.exports = MobileUserService;
