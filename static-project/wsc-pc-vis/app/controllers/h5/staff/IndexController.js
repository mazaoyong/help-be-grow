/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const StaffService = require('../../../services/sam/StaffService');

class IndexController extends BaseController {
  /**
   * 获取权限
   */
  async getStaffPerms(ctx) {
    const { kdtId = 0, biz = 0 } = ctx.query; // 此时用户还没选择店铺，ctx里还没kdtId，这个时候就需要从ctx.query取
    let adminId = ctx.query.adminId || 0;
    if (!adminId) {
      adminId = ctx.getLocalSession('userInfo').id;
    }
    const dto = {
      adminId,
      biz,
      kdtId,
      staffId: adminId,
    };
    const res = await new StaffService(ctx).getStaffPerms(dto);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 获取角色
   */
  async findStaffRole(ctx) {
    const { kdtId } = ctx.query || ctx; // 如果是小程序端调用，ctx还没有kdtId，需要从ctx.query中取
    let adminId = ctx.query.adminId || 0;
    if (!adminId) {
      adminId = ctx.getLocalSession('userInfo').id;
    }
    const biz = 'wsc';
    const dto = {
      adminId,
      biz,
      kdtId,
    };
    const res = await new StaffService(ctx).findStaffRole(dto);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
