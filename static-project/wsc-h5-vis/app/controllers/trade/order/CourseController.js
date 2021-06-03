const OrderBaseController = require('./OrderBaseController');
const CourseTradeFacade = require('../../../services/owl/edu/course/TradeFacade');

class CourseController extends OrderBaseController {
  async postRewardCourseJson(ctx) {
    const kdtId = ctx.kdtId;
    const { fansId, buyerId: userId, fansType } = this.buyer;
    const {
      channel, bizId, student,
    } = ctx.request.body;

    const result = await new CourseTradeFacade(ctx).rewardCourse({
      kdtId,
      channel,
      bizId,
      student,
      userWrapDTO: {
        userId,
        fansId,
        fansType,
      },
    });
    ctx.json(0, 'ok', result);
  }
}

module.exports = CourseController;
