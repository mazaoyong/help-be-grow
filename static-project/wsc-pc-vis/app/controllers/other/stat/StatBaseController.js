const get = require('lodash/get');
const startOfToday = require('date-fns/start_of_today');
const isBefore = require('date-fns/is_before');
const addHours = require('date-fns/add_hours');
const startOfYesterday = require('date-fns/start_of_yesterday');
const format = require('date-fns/format');
const subMonths = require('date-fns/sub_months');
const startOfMonth = require('date-fns/start_of_month');
const endOfMonth = require('date-fns/end_of_month');
const BaseController = require('../../base/BaseController');
const DataReadyProgressFacade = require('../../../services/owl/pc/datacenter/DataReadyProgressFacade');

class StatBaseController extends BaseController {
  init() {
    super.init();
  }

  async getDayDataReadyProgress(ctx, dataModule) {
    const now = new Date();
    const yesterday = format(startOfYesterday(), 'YYYYMMDD');
    const today = startOfToday();
    const isBeforeSevenOclock = isBefore(now, addHours(today, 7));
    let yesterdayReady = !isBeforeSevenOclock;

    try {
      const yesterdayReadyStatus = await new DataReadyProgressFacade(ctx).getByDate({
        dateParam: {
          startDay: yesterday,
          endDay: yesterday,
          dateType: 1,
        },
        dataModule,
      });
      yesterdayReady = get(yesterdayReadyStatus, 'readyProgress', 1);
    } catch (e) {
      // do nothing
    }
    ctx.setGlobal('yesterdayReady', yesterdayReady);
  }

  async getMonthDataReadyProgress(ctx, dataModule) {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const lastMonthStart = format(startOfMonth(lastMonth), 'YYYYMMDD');
    const lastMonthEnd = format(endOfMonth(lastMonth), 'YYYYMMDD');
    const today = startOfToday();
    const isBeforeSevenOclock = isBefore(now, addHours(today, 7));
    let lastMonthReady = !isBeforeSevenOclock;

    try {
      const lastMonthReadyStatus = await new DataReadyProgressFacade(ctx).getByDate({
        dateParam: {
          startDay: lastMonthStart,
          endDay: lastMonthEnd,
          dateType: 3,
        },
        dataModule,
      });
      lastMonthReady = get(lastMonthReadyStatus, 'readyProgress', 1);
    } catch (e) {
      // do nothing
    }
    ctx.setGlobal('lastMonthReady', lastMonthReady);
  }

  getQueryParams(ctx, method = 'get') {
    const { dateType, startDay, endDay, subKdtId, hqKdtId, queryType } =
      method === 'get' ? ctx.getQueryParse() : ctx.getPostData();
    const { kdtId } = ctx;
    const queryKdtId = +subKdtId || kdtId;

    this.validator
      .isNumeric(dateType, '无效的参数 dateType')
      .isNumeric(startDay, '无效的参数 startDay')
      .isNumeric(endDay, '无效的参数 endDay')
      .isNumeric(queryType, '无效的参数 queryType')
      .isNumeric(subKdtId, '无效的参数 subKdtId')
      .isNumeric(hqKdtId, '无效的参数 hqKdtId');

    return {
      dateParam: {
        dateType,
        startDay,
        endDay,
      },
      kdtParam: {
        kdtId: queryKdtId,
        hqKdtId,
        queryType,
      },
      kdtId
    };
  }
}

module.exports = StatBaseController;
