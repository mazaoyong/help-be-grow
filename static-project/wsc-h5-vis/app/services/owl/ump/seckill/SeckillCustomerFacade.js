const BaseService = require('../../../base/BaseService');
/* com.youzan.owl.api.client.ump.seckill.SeckillCustomerFacade -  */

class SeckillCustomerFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.seckill.SeckillCustomerFacade';
  }

  /**
   *  查询秒杀活动聚合信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1055502
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询请求
   *  @param {string} query.goodsAlias - 商品alias
   *  @param {string} query.seckillAlias - 秒杀活动alias
   *  @param {boolean} query.includeSalesman - 是否查询分销员活动
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getWithAggregate(kdtId, query) {
    return this.invoke('getWithAggregate', [kdtId, query]);
  }
}

module.exports = SeckillCustomerFacade;
