const BaseController = require('../base/BaseNewController');

class EduBaseController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.eduAcl();
    }
  }

  /**
   * @description 页面的 acl 写在 renderController 里对应的 controller，不要统一写在这
   */
  async eduAcl() {
    const { path } = this.ctx;
    const map = ['/wscvis/edu/order-confirm', '/pay/wscvis_edu_pay', '/wscvis/edu/student-list', '/wscvis/edu/student-edit'];
    if (map.indexOf(path) > -1) {
      await this.baseAcl({
        forceOauthLogin: true,
        weixinOauthScope: 'snsapi_userinfo',
      });
    }
  }
}

module.exports = EduBaseController;
