const KnowledgeBaseController = require('./KnowledgeBaseController');
const ProfitService = require('../../services/knowledge/ProfitService');

class ProfitController extends KnowledgeBaseController {
  /*
  * 获取收益信息
  */
  async getProfitInfoJson(ctx) {
    const buyerId = this.ctx.buyerId;
    const params = {
      feeType: 'RECOMMEND_COMMISSION', // 推荐有礼
      includeUnsettled: true,
      userId: buyerId,
      startTime: new Date().setMonth(new Date().getMonth() - 3),
      endTime: new Date().getTime(),
    };
    console.log('params:', params);
    const profitService = new ProfitService(ctx);
    /* let totalAmount = new ProfitService(ctx).getQueryTotalAmount(params);
    let settleAmount = new ProfitService(ctx).getQueryToSettleAmount(params);
    console.log('totalAmount', totalAmount); */
    let result = {};
    await Promise.all([
      profitService.getQueryTotalAmount(params),
      profitService.getQueryToSettleAmount(params),
    ])
      .then((res) => {
        result = {
          totalAmount: res[0],
          settleAmount: res[1],
        };
      });

    /* const result = {
      totalAmount,
      settleAmount
    }; */

    ctx.json(0, 'ok', result);
  }

  /*
  * 获取明细
  */
  async getProfitDetailJson(ctx) {
    const buyerId = this.ctx.buyerId;
    const params = {
      feeType: 'RECOMMEND_COMMISSION', // 推荐有礼
      includeUnsettled: true,
      userId: buyerId,
      startTime: new Date().setMonth(new Date().getMonth() - 3),
      endTime: new Date().getTime(),
      pageNo: ctx.query.pageNo || 1,
      pageSize: ctx.query.pageSize || 3,
    };

    const result = await new ProfitService(ctx).getQueryDetail(params);

    ctx.json(0, 'ok', result);
  }
}

module.exports = ProfitController;
