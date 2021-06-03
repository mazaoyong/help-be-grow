const UserInfoService = require('../../services/uic/user/UserInfoService');
const BaseController = require('../../controllers/base/BaseNewController');
const WeappBusinessService = require('../../services/shop/WeappBusinessService');
const get = require('lodash/get');

class UserInfoController extends BaseController {
  // 根据用户id和kdtId查询用户头像昵称等信息
  async getWechatUserInfoByUserIdJson(ctx) {
    const kdtId = ctx.kdtId || 0;
    const userId = ctx.query.userId || 0;
    const result = await new UserInfoService(ctx).getWechatUserInfoByUserId({ kdtId, userId });
    ctx.json(0, 'ok', result);
  }

  async getShopServicePhoneJson(ctx) {
    const kdtId = ctx.kdtId || 0;
    const result = await new WeappBusinessService(ctx).getShopServicePhone(kdtId);
    ctx.json(0, 'ok', result);
  }

  async getSessionUserInfo(ctx) {
    const userInfo = ctx.getLocalSession() || {};
    const mobile = get(userInfo, 'user.mobile');
    const userId = ctx.userId;
    const user = {
      userId,
      sessionId: ctx.sessionId,
      mobile,
    };
    ctx.json(0, 'ok', user);
  }
}

module.exports = UserInfoController;
