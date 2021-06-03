const BaseService = require('../../base/BaseService');

/**
 * com.youzan.ump.manage.api.GoodsSelectorConfigService -
 */
class GoodsSelectorConfigService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.manage.goods.api.GoodsSelectorService';
  }

  /**
   *  查询商品选择器的配置信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/592711
   *
   *  @param {Object} param -
   *  @param {string} param.domain - 业务域
   *  @param {number} param.umpType - 活动类型
   *  @param {number} param.industry - 店铺所属行业 com.youzan.ump.config.center.domain.dimension.value.IndustryEnum
   *  @param {number} param.shopId - 店铺id
   *  @param {Array.<Array>} param.goodsTypes[] - 商品类型
   *  @param {Array} param.goodsTypes[] -
   *  @param {string} param.goodsChannel - 商品渠道 "ONLINE", "OFFLINE"
   *  @return {Promise}
   */
  async queryGoodsSelectorConfig(param) {
    return this.invoke('queryGoodsSelectorConfig', [param]);
  }

  /**
   *  商品选择器查询商品列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/597435
   *
   *  @param {Object} param -
   *  @param {number} param.activityId - 商品参与的活动id 编辑时需要传入
   *  @param {string} param.goodsClusterType - 商品类型聚合类型
   *  @param {number} param.pageNo -
   *  @param {number} param.goodsGroupId - 商品分组id
   *  @param {number} param.umpType - 活动类型
   *  @param {number} param.pageSize -
   *  @param {number} param.shopId - 店铺id
   *  @param {string} param.goodsChannel - 商品渠道 com.youzan.ump.config.center.domain.dimension.value.GoodsChannelEnum
   *  @param {string} param.keyword - 搜索关键词
   *  @return {Promise}
   */
  async queryGoodsList(param) {
    return this.invoke('queryGoodsList', [param]);
  }
}

module.exports = GoodsSelectorConfigService;
