const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.ump.api.core.ActivityFacade -  */
class ActivityFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.core.ActivityFacade';
  }

  /**
    *  根据商品查询可以参加的活动信息
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/269456
    *
    *  @param {number} kdtId -
    *  @param {Object} query -
    *  @param {number=} query.owlType - 知识商品类型
    *  @param {number=} query.productId - 商品id
    *  @param {number} query.userId - 用户id
    *  @param {Array.<number>=} query.includeActivityTypes - 需要查询的活动类型
不传的话默认查除秒杀外的活动, 若查秒杀活动传12
    *  @param {Array=} query.includeActivityTypes[] -
    *  @param {number} query.productType - ic商品类型
    *  @param {string} query.productAlias - 商品别名
    *  @return {Promise}
    */
  async findByProduct(kdtId, query) {
    return this.invoke('findByProduct', [kdtId, query]);
  }
}

module.exports = ActivityFacade;
