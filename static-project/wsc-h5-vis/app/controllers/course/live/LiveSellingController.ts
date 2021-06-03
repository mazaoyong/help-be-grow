import { Context } from "astroboy";
import BaseController from "../../base/BaseController";
import LiveCouponFacade from "../../../services/api/owl/api/LiveCouponFacade";
import LiveItemFacade from "../../../services/api/owl/api/LiveItemFacade";
import LiveDashboardFacade from "../../../services/api/owl/api/LiveDashboardFacade";
import type { ILiveCouponReceiveCommand } from "definitions/api/owl/api/CouponFacade/receiveCoupon";
import type {
  IPageRequest,
  ILiveItemQuery
} from "definitions/api/owl/api/LiveItemFacade/findPage";

class LiveSellingController extends BaseController {
  /** */
  async getFindCouponListJson(ctx: Context) {
    const requestData = ctx.getQueryParse();
    requestData.liveUserId = ctx.userId;

    const result = await new LiveCouponFacade(ctx).findCouponList(
      ctx.kdtId,
      requestData
    );
    ctx.json(0, "ok", result);
  }

  /** */
  async postReceiveCouponJson(ctx: Context) {
    const requestData: ILiveCouponReceiveCommand = ctx.getRequestData();
    requestData.liveUserId = ctx.userId;

    const result = await new LiveCouponFacade(ctx).receiveCoupon(
      ctx.kdtId,
      requestData
    );
    ctx.json(0, "ok", result);
  }

  /** @desciption 分页查询直播间商品 */
  async getFindPageJson(ctx: Context) {
    const requestData = ctx.getQueryParse();
    const pageRequest: IPageRequest = requestData.pageRequest;
    const query: ILiveItemQuery = requestData.query;
    query.userId = ctx.userId;

    const result = await new LiveItemFacade(ctx).findPage(
      ctx.kdtId,
      pageRequest,
      query
    );
    ctx.json(0, "ok", result);
  }

  /** @desciption 直播间卖货开关状态查询 */
  async getGetLiveMarketingSettingJson(ctx: Context) {
    const requestData = ctx.getQueryParse();
    const liveAlias: string = requestData.liveAlias;

    const result = await new LiveDashboardFacade(ctx).getLiveMarketingSetting(
      ctx.kdtId,
      liveAlias
    );
    ctx.json(0, "ok", result);
  }
}

export = LiveSellingController;
