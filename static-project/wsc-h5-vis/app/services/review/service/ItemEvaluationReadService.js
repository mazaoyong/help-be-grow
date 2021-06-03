const BaseService = require('../../base/BaseService');

class ItemEvaluationReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.review.service.ItemEvaluationReadService';
  }

  // 根据商品alias单个商品汇总评价信息
  async getItemSummary(params) {
    const result = await this.owlInvoke('getItemSummary', [params]);

    return result;
  }

  // 获取最近一条评价信息
  async getLeastItemEvaluation(params) {
    const result = await this.owlInvoke('getLeastItemEvaluation', [params]);

    return result;
  }
}

module.exports = ItemEvaluationReadService;
