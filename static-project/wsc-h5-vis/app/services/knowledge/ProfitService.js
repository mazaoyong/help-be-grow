const KnowledgeBaseService = require('./KnowledgeBaseService');

class ProfitService extends KnowledgeBaseService {
  get BILL_FEE_QUERY_SERVICE() {
    return 'com.youzan.trade.settlement.api.accounting.BillFeeQueryService';
  }

  /**
  * 获取历史金额总和
  * @param {*} query
  * @param query.startTime 开始时间
  * @param query.endTime 结束时间
  * @param query.feeType 费用类型: 知识付费->RECOMMEND_COMMISSION
  * @param query.includeUnsettled 是否包含待结算金额
  * @param query.userId 销售员id，推荐有礼中为老客的buyerid
  */
  async getQueryTotalAmount(query) {
    const totalAmount = await this.owlInvoke(this.BILL_FEE_QUERY_SERVICE, 'queryTotalAmount', [query]);
    return totalAmount;
  }

  /**
  * 获取待结算金额总和
  * @param {*} query
  * @param query.startTime 开始时间
  * @param query.endTime 结束时间
  * @param query.feeType 费用类型: 知识付费->RECOMMEND_COMMISSION
  * @param query.includeUnsettled 是否包含待结算金额
  * @param query.userId 销售员id，推荐有礼中为老客的buyerid
  */
  async getQueryToSettleAmount(query) {
    const settleAmount = await this.owlInvoke(this.BILL_FEE_QUERY_SERVICE, 'queryToSettleAmount', [query]);
    return settleAmount;
  }

  /**
  * 查询明细
  * @param {*} query
  * @param query.startTime 开始时间
  * @param query.endTime 结束时间
  * @param query.feeType 费用类型: 知识付费->RECOMMEND_COMMISSION
  * @param query.includeUnsettled 是否包含待结算金额
  * @param query.userId 销售员id，推荐有礼中为老客的buyerid
  * @param query.pageNo
  * @param query.pageSize
  */
  async getQueryDetail(query) {
    const result = await this.owlInvoke(this.BILL_FEE_QUERY_SERVICE, 'queryDetail', [query]);
    return result;
  }
}

module.exports = ProfitService;
