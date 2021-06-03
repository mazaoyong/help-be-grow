const BaseController = require('../base/BaseController');
const CommonActivityPCFacade = require('../../services/api/owl/pc/CommonActivityPCFacade');

class CommonController extends BaseController {
  async init() {
    super.init();
  }

  // 查询活动奖励信息
  async getRewardByPage(ctx) {
    const query = ctx.request.query;
    const kdtId = ctx.kdtId;
    const { pageNumber, pageSize = 20, activityId, activityType, rewardType, userId } = query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const command = {
      activityId,
      activityType,
      rewardType,
      userId,
    };
    const result = await new CommonActivityPCFacade(ctx).getRewardByPage(
      kdtId,
      pageRequest,
      command,
    );
    return ctx.json(0, 'ok', result);
  }

  async getRewardCopywriting(ctx) {
    const { kdtId } = ctx;
    const { awardList = [] } = ctx.request.body || {};
    const query = {
      awardList,
    };
    const res = await new CommonActivityPCFacade(ctx).getRewardCopywriting(kdtId, query);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = CommonController;
