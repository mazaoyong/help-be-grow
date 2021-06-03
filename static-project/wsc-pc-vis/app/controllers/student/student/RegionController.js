const BaseController = require('../../base/BaseController');
const RegionService = require('../../../services/api/ic/delivery/RegionService');

class RegionController extends BaseController {
  // 获取省级映射列表
  async getProvinceMap(ctx) {
    const parmas = {
      mapType: 'id_to_name',
    };
    const res = await new RegionService(ctx).getProvinceMap(parmas);
    ctx.json(0, 'success', res);
  }

  // 获取城市映射列表
  async getCityMap(ctx) {
    const { provinceId } = ctx.request.query;
    const res = await new RegionService(ctx).getCityMap('id_to_name', provinceId);
    ctx.json(0, 'success', res);
  }

  // 获取地区映射列表
  async getCountyMap(ctx) {
    const { cityId } = ctx.request.query;
    const res = await new RegionService(ctx).getCountyMap('id_to_name', cityId);
    ctx.json(0, 'success', res);
  }
}

module.exports = RegionController;
