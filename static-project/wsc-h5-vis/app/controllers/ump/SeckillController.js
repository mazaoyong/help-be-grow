const BaseController = require('../base/BaseNewController');
const SeckillPromitionService = require('../../services/ump/marketing/seckill/SeckillPromotionService');
const SeckillFacade = require('../../services/owl/ump/seckill/SeckillFacade');

class SeckillController extends BaseController {
  async getInfo(ctx) {
    const { kdtId, buyerId } = ctx;
    const result = await new SeckillFacade(ctx).getActivity(kdtId, {
      activityAlias: ctx.query.alias,
      userId: buyerId,
    });
    if (result) {
      result.beginAt = result.beginAt * 1000;
      result.endAt = result.endAt * 1000;
      ctx.json(0, 'ok', result);
    } else {
      ctx.fail(1, '网络错误');
    }
  }

  async appointment(ctx) {
    const { id } = ctx.getPostData();
    const query = {
      buyerId: ctx.buyerId,
      fansId: ctx.visBuyer.fansId,
      fansType: ctx.visBuyer.fansType,
      kdtId: ctx.kdtId,
      seckillId: id,
    };
    const result = await new SeckillPromitionService(ctx).remind(query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = SeckillController;
