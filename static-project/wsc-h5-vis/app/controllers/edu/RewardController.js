const EduBaseController = require('./EduBaseController');
const ConsumerRewardFacade = require('../../services/owl/edu/reward/ConsumerRewardFacade');

class RewardController extends EduBaseController {
  async listCustomRewardRecord(ctx) {
    const { kdtId, buyerId, query } = ctx;
    const {
      pageNumber,
      pageSize,
      courseProductAlias,
      status,
    } = query;

    const customRewardRecordQuery = {
      courseProductAlias,
      status: status.split(',').map(item => Number(item)),
      userId: buyerId,
    };
    const pageRequest = {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };
    const res = await new ConsumerRewardFacade(ctx).listCustomRewardRecord(kdtId, pageRequest, customRewardRecordQuery);
    ctx.json(0, 'ok', res);
  }

  async redeemReward(ctx) {
    const { kdtId, buyerId } = ctx;
    const {
      presentedStudentId,
      rewardRecordId,
      courseAttendDTO,
    } = ctx.getPostData();
    const rewardRedeemCommand = {
      presentedStudentId: presentedStudentId ? Number(presentedStudentId) : null,
      rewardRecordId: Number(rewardRecordId),
      userId: buyerId,
      courseAttendDTO,
    };
    const res = await new ConsumerRewardFacade(ctx).redeemReward(kdtId, rewardRedeemCommand);
    ctx.json(0, 'ok', res);
  }

  // 奖励查询
  async getRewardTip(ctx) {
    const { kdtId, buyerId, query } = ctx;
    const { alias } = query;
    const rewardTipQuery = {
      userId: buyerId,
      alias,
    };
    const res = await new ConsumerRewardFacade(ctx).getRewardTip(kdtId, rewardTipQuery);
    ctx.json(0, 'ok', res);
  }

  // 奖励弹窗
  async getRewardWindow(ctx) {
    const { buyerId, kdtId } = ctx;
    const { rootKdtId } = ctx.query;
    const rewardWindowQuery = {
      userId: buyerId,
    };
    const res = await new ConsumerRewardFacade(ctx).getRewardWindow(rootKdtId || kdtId, rewardWindowQuery);
    ctx.json(0, 'ok', res);
  }

  // 获取课程奖励活动
  async findCourseProductRewardActivity(ctx) {
    const { kdtId, query } = ctx;
    const { courseProductAlias } = query;
    const courseProductRewardActivityQuery = {
      courseProductAlias,
    };
    const res = await new ConsumerRewardFacade(ctx).findCourseProductRewardActivity(
      kdtId,
      courseProductRewardActivityQuery
    );
    ctx.json(0, 'ok', res);
  }
}

module.exports = RewardController;
