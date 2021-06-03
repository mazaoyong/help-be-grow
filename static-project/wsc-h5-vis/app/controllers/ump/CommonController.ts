import BaseController from "../base/BaseNewController";
import ActivityCommonFacade from "../../services/api/owl/api/ActivityCommonFacade";
import { IOngoingActivityQuery } from "definitions/api/owl/api/ActivityCommonFacade/listOngoingActivity";
class CommonController extends BaseController {
  /** */
  async getListOngoingActivityJson() {
    const { ctx } = this;
    const requestData = ctx.getQueryParse();
    const query: IOngoingActivityQuery = requestData;


    const result = await new ActivityCommonFacade(ctx).listOngoingActivity(
      ctx.kdtId,
      query
    );
    ctx.success(result);
  }

  async getRewardByPage() {
    const { ctx } = this;
    const { kdtId, query = {}, userId } = ctx;
    const {
      countEnabled = true,
      pageNumber = 1,
      pageSize = 10,
      activityId,
      activityType,
      rewardType,
    } = query;
    const pageRequest = {
      countEnabled,
      pageNumber,
      pageSize,
    };
    const params = {
      activityId,
      activityType,
      rewardType,
      userId
    }
    if (!activityId) {
      delete params.activityId;
    }
    const res = await new ActivityCommonFacade(ctx).getRewardByPage(kdtId, pageRequest, params);
    ctx.success(res);
  }
}

export = CommonController;
