const BaseService = require('../base/BaseService');

class GoodsComponentService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.marketing.service.GoodsComponentService';
  }

  /**
   * 获取商品参与活动的情况
   *
   * @param kdtId
   * @param goodsIds
   * @param activityType
   * @returns {Promise<void>}
   */
  async findJoinStateByGoodsIds(kdtId, goodsIds, activityType) {
    const data = await this.invoke('findJoinStateByGoodsIds', [kdtId, goodsIds, activityType, 0]);

    const ret = {};
    data.forEach(d => (ret[d.goodsId] = d));
    return ret;
  }
}

module.exports = GoodsComponentService;
