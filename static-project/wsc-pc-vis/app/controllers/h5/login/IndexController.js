/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const MobileUserService = require('../../../services/uic/auth/MobileUserService');

class IndexController extends BaseController {
  /**
   * 密码登录
   */
  async loginByPassword(ctx) {
    const { mobileUser, scene } = ctx.request.body;
    const res = await new MobileUserService(ctx).loginByPassword(mobileUser, scene);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 验证码登录
   */
  async loginBySmsCaptcha(ctx) {
    const { mobileUser, scene } = ctx.request.body;
    const res = await new MobileUserService(ctx).loginBySmsCaptcha(mobileUser, scene);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 退出当前账户
   */
  async logout(ctx) {
    const { mobileUser } = ctx.request.body;
    const scene = {};
    await new MobileUserService(ctx).logout(mobileUser, scene);
    return ctx.json(0, 'ok', true);
  }

  /**
   * 获取验证码
   */
  async sendSmsCaptchaForLogin(ctx) {
    const { mobileUser, scene } = ctx.request.body;
    const res = await new MobileUserService(ctx).sendSmsCaptchaForLogin(mobileUser, scene);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
