import BaseService from "../../../base/BaseService";
import {
  IPageRequest,
  ILiveItemQuery,
  IPage,
  ILiveItemDTO,
} from "definitions/api/owl/api/LiveItemFacade/findPage";

class LiveItemFacade extends BaseService {
  get SERVICE_NAME() {
    return "com.youzan.owl.api.client.ump.livemarketing.LiveItemFacade";
  }

  /**
   * @description 分页查询直播间商品
   * @link http://zanapi.qima-inc.com/site/service/view/942084
   */
  async findPage(
    kdtId: number,
    pageRequest: IPageRequest,
    query: ILiveItemQuery
  ): Promise<IPage<ILiveItemDTO>> {
    return this.invoke("findPage", [kdtId, pageRequest, query]);
  }
}

export = LiveItemFacade;
