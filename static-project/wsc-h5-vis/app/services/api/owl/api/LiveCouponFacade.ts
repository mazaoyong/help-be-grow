import BaseService from "../../../base/BaseService";
import {
  ILiveCouponQuery,
  ILiveCouponDTO,
} from "definitions/api/owl/api/LiveCouponFacade/findCouponList";
import { ILiveCouponReceiveCommand } from "definitions/api/owl/api/CouponFacade/receiveCoupon";

class LiveCouponFacade extends BaseService {
  get SERVICE_NAME() {
    return "com.youzan.owl.api.client.ump.livemarketing.LiveCouponFacade";
  }

  /** @link http://zanapi.qima-inc.com/site/service/view/945879 */
  async findCouponList(
    operatorKdtId: number,
    liveCouponQuery: ILiveCouponQuery
  ): Promise<Array<ILiveCouponDTO>> {
    return this.invoke("findCouponList", [operatorKdtId, liveCouponQuery]);
  }

  /** @link http://zanapi.qima-inc.com/site/service/view/942506 */
  async receiveCoupon(
    operatorKdtId: number,
    liveCouponReceiveCommand: ILiveCouponReceiveCommand
  ): Promise<boolean> {
    return this.invoke("receiveCoupon", [
      operatorKdtId,
      liveCouponReceiveCommand,
    ]);
  }
}

export = LiveCouponFacade;
