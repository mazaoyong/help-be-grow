const BaseService = require('../base/BaseService');

class ProductActivityService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.biz.service.ump.ProductActivityService';
  }

  /**
   * 批量判断商品是否在参加某个活动
   *
   * @param kdtId
   * @param goodsIds
   * @param activityType
   * @returns {Promise<void>}
   */
  async findJoinStateByGoodsIds(kdtId, goodsIds, activityType) {
    const data = await this.invoke('findJoinStateByGoodsIds', [
      {
        kdtId,
        prodIds: goodsIds,
        activityType,
      },
    ]);
    const ret = {};
    data.forEach(d => (ret[d.prodId] = d));
    return ret;
  }
}

module.exports = ProductActivityService;
