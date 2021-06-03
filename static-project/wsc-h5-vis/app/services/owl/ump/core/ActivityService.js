const BaseService = require('../../../base/BaseService');

class ActivityService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.core.ActivityFacade';
  }

  /**
   *  根据商品查询可以参加的活动信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/269456
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.userId - 用户id
   *  @param {number} query.productType - 商品类型
   *  @param {string} query.productAlias - 商品别名
   *  @param {string} query.platform - 访问渠道  微信H5: weixin  微信小程序: weapp
   *  @return {Promise}
   */
  async findByProduct(params) {
    return this.owlInvoke(this.SERVICE_NAME, 'findByProduct', [params.kdtId, { ...params.query }]);
  }
}

module.exports = ActivityService;
