const BaseService = require('../../base/BaseService');

/* com.youzan.item.detail.api.ItemSkuService -  */
class ItemSkuService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.item.detail.api.ItemSkuService';
  }

  /**
   * 获取商品规格基础信息，默认返回spu规格信息
   * 支持分销商品规格查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/312728
   *  @param {Object} param -
   *  @param {number} param.itemId - 商品ID
   *  @param {number} param.kdtId - 店铺ID
   *  @param {string} param.requestId - UUID
   *  @param {number} param.offlineId - 非必传 网点ID
   *  @param {string} param.from - 请求来源
   *  @param {number} param.skuId - 非必传 规格ID ，不传默认返回spu
   *  @return {Promise}
  */
  async getItemSkuById(param) {
    return this.invoke('getItemSkuById', [param]);
  }
}

module.exports = ItemSkuService;
