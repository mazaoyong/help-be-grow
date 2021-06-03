import BaseService from "../../../base/BaseService";
import { ILiveCouponReceiveCommand } from "definitions/api/owl/api/CouponFacade/receiveCoupon";

class CouponFacade extends BaseService {
  get SERVICE_NAME() {
    return "com.youzan.owl.api.client.ump.livemarketing.CouponFacade";
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

export = CouponFacade;
