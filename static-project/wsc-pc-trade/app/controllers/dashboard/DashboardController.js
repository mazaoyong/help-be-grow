const DashboardBaseController = require('./DashboardBaseController');
const WscDashboardService = require('../../services/datacenter/WscDashboardService');
const WscTradeService = require('../../services/datacenter/WscTradeService');
const IndexService = require('../../services/pay/IndexService');
const formatDate = require('@youzan/utils/date/formatDate').default;
const travel = require('@youzan/utils/date/travel').default;
const URL = require('@youzan/wsc-pc-base/app/lib/URL');

class DashboardController extends DashboardBaseController {
  async getIndexHtml(ctx) {
    return ctx.redirect(URL.site('/trade/dashboard', 'www'));
  }

  async getOrderOverviewData(ctx) {
    const { kdtId } = ctx;
    const userInfo = ctx.getLocalSession('userInfo');
    const operator = {
      // eslint-disable-next-line camelcase
      user_id: userInfo.id,
      // eslint-disable-next-line camelcase
      nick_name: userInfo.nickName,
    };

    let overviewData = {};
    let rangeData = [];
    let incomeData = '';

    try {
      incomeData = await new IndexService(ctx).balanceDaysIncome({
        kdtId,
        startDate: formatDate(travel(-7), 'YYYY-MM-DD'),
        endDate: formatDate(travel(-1), 'YYYY-MM-DD'),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    try {
      overviewData = await new WscDashboardService(ctx).getWscDashboard({
        kdtId,
        operator: JSON.stringify(operator),
        currentDay: formatDate(new Date(), 'YYYYMMDD'),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    try {
      rangeData = await new WscTradeService(ctx).getOrderTrendDaily({
        kdtId,
        operator: JSON.stringify(operator),
        canalType: 0, // 10：全店; 0：网店; 1：门店
        dateType: 1,
        startDay: formatDate(travel(-7), 'YYYYMMDD'),
        endDay: formatDate(travel(-1), 'YYYYMMDD'),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    ctx.json(0, 'ok', {
      incomeData,
      overviewData,
      rangeData,
    });
  }
}

module.exports = DashboardController;
