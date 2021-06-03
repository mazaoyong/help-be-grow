const BaseController = require('../base/BaseController');

class CertController extends BaseController {
  async getGroupCertification(ctx) {
    // 新接入可参考：https://doc.qima-inc.com/pages/viewpage.action?pageId=217951843
    // http://api.koudaitong.com/shop/cert/certification/getGroupCertification
    ctx.json(0, 'ok');
  }
}

module.exports = CertController;
