import BaseService from "../../../base/BaseService";
import {
  IPageRequest,
  IActivityGoodsQuery,
  IPage,
  IActivityGoodsDTO
} from "definitions/api/owl/api/ActivityCommonFacade/findGoodsByPage";
import {
  IOngoingActivityQuery,
  IActivitySimpleInfoDTO
} from "definitions/api/owl/api/ActivityCommonFacade/listOngoingActivity";

import { IRewardQuery, IRewardRecord } from "definitions/api/owl/api/ActivityCommonFacade/getRewardByPage";

class ActivityCommonFacade extends BaseService {
  public readonly SERVICE_NAME =
    "com.youzan.owl.api.client.ump.activity.ActivityCommonFacade";

  /**
   * @description 查询活动关联商品(通用能力)
   * @link http://zanapi.qima-inc.com/site/service/view/959014
   */
  async findGoodsByPage(
    kdtId: number,
    pageRequest: IPageRequest,
    query: IActivityGoodsQuery
  ): Promise<IPage<IActivityGoodsDTO>> {
    return this.invoke("findGoodsByPage", [kdtId, pageRequest, query]);
  }

  /** @link http://zanapi.qima-inc.com/site/service/view/966263 */
  async listOngoingActivity(
    kdtId: number,
    query: IOngoingActivityQuery
  ): Promise<Array<IActivitySimpleInfoDTO>> {
    return this.invoke("listOngoingActivity", [kdtId, query]);
  }

  /** @link http://zanapi.qima-inc.com/site/service/view/1042559 */
  async getRewardByPage(kdtId: number, pageRequest: IPageRequest, query: IRewardQuery):
    Promise<Array<IRewardRecord>> {
    return this.invoke('getRewardByPage', [kdtId, pageRequest, query]);
  }
}

export = ActivityCommonFacade;
