/**
 * ump活动中用到的商品选择组件通用接口
 * TODO 目前这个接口不够通用，后续可能需要重新梳理统一 @新尧
 */
const BaseController = require('../base/BaseController');
const OwlUmpServcie = require('../../services/owl/ump/ActivityApiServcie');

class OwlUmpController extends BaseController {
  async getGoodsList(ctx) {
    const kdtId = ctx.kdtId;
    const { pageIndex, pageSize, goodsType, activityType, activityId } = ctx.request.query || {};
    const owlUmpService = new OwlUmpServcie(ctx);

    const res = await owlUmpService.getGoodsList(
      kdtId,
      pageIndex,
      pageSize,
      goodsType,
      activityType,
      activityId
    );

    ctx.json(0, 'ok', res);
  }
}

module.exports = OwlUmpController;
