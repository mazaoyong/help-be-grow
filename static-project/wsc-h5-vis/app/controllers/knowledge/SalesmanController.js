const BaseController = require('../base/BaseNewController');
const SalesmanService = require('../../services/owl/ump/salesman/SalesmanService');

class SalesmanController extends BaseController {
  /**
   * 根据用户的userId获取其分销员信息
   * @param {*} ctx
   */
  async postRegisterJson(ctx) {
    const kdtId = ctx.kdtId;
    const adminId = ctx.buyerId; // adminId即为userId/buyerId，叫adminId的原因是userId是Carmen的关键字

    let result = await new SalesmanService(ctx).register([kdtId, adminId]);
    ctx.json(0, 'ok', result);
  }

  // 获取分销员信息
  async getShareIconJson(ctx) {
    const query = {
      kdtId: ctx.kdtId,
      sellerFrom: ctx.query.sls,
      buyerId: ctx.buyerId.buyerId,
      fansId: this.visBuyer.fansId,
      fansType: this.visBuyer.fansType,
    };
    const result = await new SalesmanService(ctx).getShareIcon(query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = SalesmanController;
