/* eslint-disable jsdoc/require-param */
const BaseController = require('../base/BaseController');
const ShopCourseSettingFacade = require('../../services/owl/pc/shop/ShopCourseSettingFacade');

/**
 * 课程设置
 */
class CourseSettingController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByMultiNamespace(this.ctx, [
        {
          namespaceId: 'course',
          businessId: 'wsc-pc-vis',
        },
      ]);
    }
  }

  /**
   * 主页
   */
  async getIndexHtml(ctx) {
    await ctx.render('course/course-setting/index.html');
  }

  /**
   * 保存课程设置
   */
  async saveCourseSettings(ctx) {
    const kdtId = ctx.kdtId;
    const data = ctx.request.body || {};
    const res = await new ShopCourseSettingFacade(ctx).saveCourseSettings(kdtId, data.settingData);
    ctx.json(0, 'ok', res);
  }

  /**
   * 查询课程设置
   */
  async findCourseSettings(ctx) {
    const kdtId = ctx.kdtId;
    const res = await new ShopCourseSettingFacade(ctx).findCourseSettings(kdtId);
    ctx.json(0, 'ok', res);
  }
}

module.exports = CourseSettingController;
