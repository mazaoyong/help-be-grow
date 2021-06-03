import BaseService from "../../../base/BaseService";
import { IPcLiveRoomSettingDTO } from "definitions/api/owl/api/LiveDashboardFacade/getLiveMarketingSetting";

class LiveDashboardFacade extends BaseService {
  get SERVICE_NAME() {
    return "com.youzan.owl.api.client.ump.livemarketing.LiveDashboardFacade";
  }

  /**
   * @description 直播间卖货开关状态查询
   * @link http://zanapi.qima-inc.com/site/service/view/945933
   */
  async getLiveMarketingSetting(
    kdtId: number,
    liveAlias: string
  ): Promise<IPcLiveRoomSettingDTO> {
    return this.invoke("getLiveMarketingSetting", [kdtId, liveAlias]);
  }
}

export = LiveDashboardFacade;
