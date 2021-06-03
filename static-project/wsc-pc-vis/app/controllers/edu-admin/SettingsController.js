const BaseController = require('../base/BaseController');
const EduConfigService = require('../../services/owl/oc/setting/EduConfigService');
const EduConfigFacade = require('../../services/owl/pc/educonfig/EduConfigFacade');

/**
 * 教务设置
 */
class SettingsController extends BaseController {
  init() {
    super.init();
  }

  /**
   * 主页
   *
   * @param {Object} ctx
   */
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );

    ctx.setGlobal('lifecycle', lifecycle);

    await ctx.render('edu-admin/settings/index.html');
  }

  /**
   * 新增
   *
   * @param {Object} ctx
   */
  async createEduConfig(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    const res = await new EduConfigService(ctx).create(kdtId, req);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 修改
   *
   * @param {Object} ctx
   */
  async updateEduConfig(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    const res = await new EduConfigService(ctx).update(kdtId, req);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 查询
   *
   * @param {Object} ctx
   */
  async getEduConfig(ctx) {
    const kdtId = ctx.kdtId;
    const res = await new EduConfigService(ctx).getByKdtId(kdtId);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 查询预约设置
   */
  async getAppointmentConfig(ctx) {
    const kdtId = ctx.kdtId;
    const res = await new EduConfigFacade(ctx).getAppointmentConfig(kdtId);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 修改预约设置
   */
  async updateAppointmentConfig(ctx) {
    const kdtId = ctx.kdtId;
    const data = ctx.request.body || {};
    const res = await new EduConfigFacade(ctx).updateAppointmentConfig(Object.assign({}, data, { kdtId }));
    return ctx.json(0, 'ok', res);
  }

  /**
   * 根据店铺id获取是否有预约配置的权限
   */
  async isShopAppointmentConfigIndependent(ctx) {
    const kdtId = ctx.kdtId;
    const res = await new EduConfigFacade(ctx).isShopAppointmentConfigIndependent(kdtId);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = SettingsController;
