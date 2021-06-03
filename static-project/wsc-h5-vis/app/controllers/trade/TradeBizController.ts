import { Context } from 'astroboy';

import TradeBaseController from './TradeBaseController';
import TradeOrderFacade from '../../services/api/owl/api/TradeOrderFacade';

class TradeBizController extends TradeBaseController {
  // 商品页下单用的缓存接口
  public async postCacheJson(ctx: Context) {
    const postData = this.getBuyPostData(ctx);
    const res = await new TradeOrderFacade(ctx).cache(postData);
    ctx.json(0, 'ok', res);
  }
}

export = TradeBizController;
