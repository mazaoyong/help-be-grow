const ScheduleFacade = require('../../services/owl/client/edu/schedule/ScheduleFacade');
const EduBaseController = require('./EduBaseController');

class ScheduleFacadeController extends EduBaseController {
  // 线下课列表
  async findPageStuScheduleJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;

    const {
      pageNumber,
      pageSize,
    } = ctx.query;
    const scheduleQuery = {
      userId,
    };
    const pageRequest = {
      pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
    };
    const res = await new ScheduleFacade(ctx).findPageStuSchedule(kdtId, scheduleQuery, pageRequest);
    ctx.json(0, 'ok', res);
  }

  // 线下课详情
  async findStuScheduleByConditionJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    // const userId = 899778840;

    const {
      assetNo,
    } = ctx.query;
    const scheduleQuery = {
      assetNo,
      userId,
    };
    const res = await new ScheduleFacade(ctx).findStuScheduleByCondition(kdtId, scheduleQuery);
    ctx.json(0, 'ok', res);
  }

  // 全部待上课记录列表
  async findWaitingLessonPageJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;

    const {
      assetNo,
      pageNumber,
      pageSize,
    } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'ASC',
            property: 'start_time',
          },
        ],
      },
    };
    const scheduleQuery = {
      assetNo,
      userId,
    };
    const res = await new ScheduleFacade(ctx).findWaitingLessonPage(kdtId, pageRequest, scheduleQuery);
    ctx.json(0, 'ok', res);
  }
}

module.exports = ScheduleFacadeController;
