import BaseController from '../base/BaseNewController';
import GoodsActivityReadService from '../../services/ump/goods/GoodsActivityReadService';
import VoucherSendService from '../../services/ump/goods/VoucherSendService';

class GoodsController extends BaseController {
  // 获取优惠券
  async getCouponList() {
    const { ctx } = this;
    const query = ctx.getQueryData();

    const params = {
      ...query,
      kdtId: ctx.kdtId,
    };

    const result = await new GoodsActivityReadService(ctx).listAvlActivities(
      params
    );

    ctx.json(0, 'ok', result);
  }

  // 领取优惠券接口
  async receiveCouponJson() {
    const { ctx } = this;
    const { kdt_id, bizName, ...query } = ctx.getQueryData();
    const { buyerId, fansId, fansType } = this.buyer;
    const params = {
      ...query,
      fansType,
      fansId,
      kdtId: ctx.kdtId,
      userId: buyerId,
      bizName,
      source: bizName,
    };

    if (!buyerId && !ctx.userId) {
      ctx.json(10000, '请登录后再领取');
      return;
    }

    const result = await new VoucherSendService(ctx).send(params);

    ctx.json(0, 'ok', result);
  }
}

export = GoodsController;
