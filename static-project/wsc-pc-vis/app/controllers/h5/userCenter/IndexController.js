/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const AdminService = require('../../../services/owl/pc/teacher/AdminService');
const ShopQueryService = require('../../../services/owl/pc/shop/ShopQueryService');

class IndexController extends BaseController {
  /**
   * 个人中心页面
   */
  async getIndexHtml(ctx) {
    await ctx.render('h5/user-center.html');
  }

  /**
   *  获取当前用户的信息
   */
  async getTeacherInfoById(ctx) {
    const { kdtId = 0 } = ctx;
    const { id: staffId } = ctx.getLocalSession('userInfo');
    const res = await new AdminService(ctx).getById(kdtId, staffId);
    return ctx.json(0, 'ok', res);
  }

  /**
   *  更新当前用户的头像
   */
  async updateTeacherAvatar(ctx) {
    const { kdtId = 0, userId } = ctx;
    const { avatar } = ctx.request.body;
    const query = {
      avatar,
      userId,
    };
    const res = await new AdminService(ctx).update(kdtId, query);
    return ctx.json(0, 'ok', res);
  }

  /**
   *  获取当前机构的信息
   */
  async getShopInfoByKdtId(ctx) {
    const { kdtId = 0 } = ctx;
    const res = await new ShopQueryService(ctx).getShopBaseInfoByKdtId(kdtId);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
