const BaseService = require('../../../base/BaseService');

/** com.youzan.ic.service.ItemQueryService -  */
class ItemQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ic.service.ItemQueryService';
  }

  /**
   * 通过kdtId和itemId集合 查询商品列表，返回goodsV2基本信息以及排序后的SKU。
   * https://doc.qima-inc.com/pages/viewpage.action?pageId=226571099
   *
   * @param {number} kdtId 店铺id
   * @param {Array} itemIds 商品id列表
   * @return any
   */
  async listItemWithSortedSku(kdtId, itemIds) {
    return this.invoke('listItemWithSortedSku', [
      {
        kdtId,
        itemIds,
        isNeedSlaveCreatedNormalBack: true, // 支持网店自建商品
      },
    ]);
  }
}

module.exports = ItemQueryService;
