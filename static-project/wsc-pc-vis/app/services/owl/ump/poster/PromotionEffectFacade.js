const BaseService = require('../../../base/BaseService');
/**
 * com.youzan.owl.ump.api.poster.PromotionEffectFacade
 */
class PromotionEffectFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.poster.PromotionEffectFacade';
  }

  /**
   * @param {*} kdtId - 店铺Id
   * @param {*} pageRequest - 分页条件
   * @param {*} collectZanPromotionEffectQuery - 好友助力活动查询条件
   */
  async findCollectZanPromotionEffect(kdtId, pageRequest, collectZanPromotionEffectQuery) {
    return this.invoke('findCollectZanPromotionEffect', [
      kdtId,
      pageRequest,
      collectZanPromotionEffectQuery,
    ]);
  }
  /**
   *  分页查询活动推广效果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/287188
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object]} pageRequest.sort.orders -
   *  @param {Object} query - 查询参数
   *  @param {string} query.userLike - 根据用户（名称|手机号）模糊查询
   *  @return {Promise}
   */
  async find(kdtId, pageRequest, query) {
    return this.invoke('find', [kdtId, pageRequest, query]);
  }
}

module.exports = PromotionEffectFacade;
