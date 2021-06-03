const ReviewBaseService = require('./ReviewBaseService');

/**
 * 售后评价相关
 */
class ItemEvaluationReadService extends ReviewBaseService {
  /**
   * ItemEvaluationReadService
   */
  get SERVICE_NAME() {
    return 'com.youzan.review.service.ItemEvaluationReadService';
  }

  /**
   * 查询订单发票列表
   * http://zanapi.qima-inc.com/site/service/view/277665
   *  @param {object} param
   */
  async pageEvaluationComment4B(param) {
    return this.invoke('pageEvaluationComment4B', [param]);
  }
}

module.exports = ItemEvaluationReadService;
