const OrderBaseController = require('./OrderBaseController');
const UserInfoService = require('../../services/pay/UserInfoService');
const AccountService = require('../../services/pay/AccountService');

class AccountController extends OrderBaseController {
  /**
   * 查询店铺账户（余额）信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getAccountBalance(ctx) {
    const { kdtId } = ctx;
    // 获取商户号
    const shopNo = await new UserInfoService(ctx).queryUserNoByKdtId(kdtId);
    // 获取店铺余额信息
    const result = await new AccountService(ctx).queryBalance(
      shopNo,
      // 余额账户 - 10
      10,
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = AccountController;
