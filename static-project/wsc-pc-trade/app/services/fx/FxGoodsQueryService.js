const FxBaseService = require('./FxBaseService');

/**
 * 分销商品查询
 */
class FxGoodsQueryService extends FxBaseService {
  /**
   * FxGoodsQueryService
   */
  get SERVICE_NAME() {
    return 'com.youzan.fx.goods.service.FxGoodsQueryService';
  }

  /**
   * 获取使用此分销运费模板的商品数量
   * api: http://zanapi.qima-inc.com/site/service/view/140363
   * @param {number} kdtId
   * @param {number} deliveryTemplateId 运费模板 id
   */
  async getGoodsNumByFxDeliveryTemplateId(kdtId, deliveryTemplateId) {
    return this.invoke('getGoodsNumByFxDeliveryTemplateId', [kdtId, [deliveryTemplateId]]);
  }
}

module.exports = FxGoodsQueryService;
