const BaseController = require('../base/BaseController');
const DateRangeConfigFacadeService = require('../../services/owl/pc/schedule/DateRangeConfigFacade');

// 时间段
class DateRangeController extends BaseController {
  // 创建
  async create(ctx) {
    const { kdtId } = ctx;
    const { startTime, endTime, configType } = ctx.request.body || {};

    const res = await new DateRangeConfigFacadeService(ctx).create(kdtId, {
      startTime,
      endTime,
      configType,
    });

    ctx.json(0, 'ok', res);
  }

  // 根据kdtId获取时间段列表
  async findByKdtId(ctx) {
    const { kdtId } = ctx;
    const { configType } = ctx.request.query || {};

    const res = await new DateRangeConfigFacadeService(ctx).findByKdtId(kdtId, configType);

    ctx.json(0, 'ok', res);
  }

  // 更新
  async update(ctx) {
    const { kdtId } = ctx;
    const { id, startTime, endTime, configType } = ctx.request.body || {};

    const res = await new DateRangeConfigFacadeService(ctx).update(kdtId, {
      id,
      startTime,
      endTime,
      configType,
    });

    ctx.json(0, 'ok', res);
  }

  // 删除
  async delete(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.request.body || {};

    const res = await new DateRangeConfigFacadeService(ctx).delete(kdtId, id);

    ctx.json(0, 'ok', res);
  }
}

module.exports = DateRangeController;
