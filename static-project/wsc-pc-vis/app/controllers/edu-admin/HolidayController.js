const BaseController = require('../base/BaseController');
const CustomHolidayService = require('../../services/api/owl/pc/CustomHolidayFacade');
const NationalHolidayReadService = require('../../services/api/showcase/front/NationalHolidayReadService');

/**
 * 节假日相关
 */
class SettingsController extends BaseController {
  /**
   * 设置页
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
   * 根据ID查询节假日
   */
  async getHolidayById(ctx) {
    const { kdtId, request } = ctx;
    const data = await new CustomHolidayService(ctx).getById(kdtId, request.body.holidayId);
    return ctx.json(0, 'ok', data);
  }

  /**
   * 创建自定义节假日
   */
  async createHoliday(ctx) {
    const { kdtId, request } = ctx;
    const { item } = request.body;
    const data = await new CustomHolidayService(ctx).create(kdtId, item);
    return ctx.json(0, 'ok', data);
  }

  /**
   * 修改自定义节假日
   */
  async updateHoliday(ctx) {
    const { kdtId, request } = ctx;
    const { item } = request.body;
    const data = await new CustomHolidayService(ctx).update(kdtId, item);
    return ctx.json(0, 'ok', data);
  }

  /**
   * 删除自定义节假日
   */
  async deleteHoliday(ctx) {
    const { kdtId, request } = ctx;
    const { holidayId } = request.body;
    const data = await new CustomHolidayService(ctx).delete(kdtId, holidayId);
    return ctx.json(0, 'ok', data);
  }

  /**
   * 分页查询节假日
   */
  async findHolidayPage(ctx) {
    const { kdtId } = ctx;
    const { pageRequest = {}, query = {} } = ctx.getQueryParse() || {};
    const data = await new CustomHolidayService(ctx).findPage(kdtId, pageRequest, query || {});
    return ctx.json(0, 'ok', data);
  }

  /**
   * 查询节假日
   */
  async findHoliday(ctx) {
    const { kdtId } = ctx;
    const {
      name,
      startTime,
      endTime,
      operator,
      countEnabled,
    } = ctx.getQueryParse();
    const data = await new CustomHolidayService(ctx).find(
      kdtId,
      {
        name,
        startTime,
        endTime,
        operator,
        countEnabled,
      },
    );
    return ctx.json(0, 'ok', data);
  }

  /**
   * 按年查询法定节假日
   */
  async listAllNationalByYear(ctx) {
    const { year } = ctx.getQueryParse();
    const res = await new NationalHolidayReadService(ctx).listAllByYear({ year });
    return ctx.json(0, 'ok', res);
  }
}

module.exports = SettingsController;
