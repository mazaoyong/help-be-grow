const BaseService = require('../base/BaseService');

class ItemQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.mall.item.api.ItemQueryService';
  }

  /**
   * 获取商品列表
   * https://doc.qima-inc.com/pages/viewpage.action?pageId=48937130
   * https://doc.qima-inc.com/pages/viewpage.action?pageId=10039989
   * 不支持商品类型为：周期购、电子卡券、酒店、知识付费、拍卖类型的商品，不支持门店商品
   * @param kdtId             - 店铺ID
   * @param page              - 页码
   * @param pageSize          - 分页大小
   * @param keyword           - 关键字（支持商品标题、编码）
   * @param group             - 商品组 ID
   * @param type              - 商品类型：real实物商品、virtual虚拟商品、knowledge知识付费
   * @param isVirtual         - 虚拟商品类型
   * @returns {Promise<{items, total}>}
   */

  async listItemsPaged({ kdtId, channel, type, group, page, pageSize, keyword }) {
    const req = {
      kdtId,
      page,
      pageSize,
      // channel, // 网店
      queryOption: {
        withItemGroupDetail: true, // 返回商品分组信息
        withD30SoldNumboolean: true, // 是否返回30天销量
      },
      itemTypes: [31],
      excludeAbilityMarks: [70001],
      // 需要过滤的商品类型
      itemTypesExclude: [
        0, // 普通商品
        1, // 拍卖商品
        10, // 分销商品
        24, // 周期商品
        // 31, // 知识付费
        35, // 酒店商品
      ],
      owlItemTypes: [group],
    };

    if (type === 'knowledge') {
      req.itemTypesNotExclude = [31];
    }

    if (keyword) {
      req.keyword = keyword;
    }

    const {
      items,
      paginator: { totalCount: count },
    } = await this.invoke('listItemsPaged', [req]);

    return { items, count };
  }

  /**
   * 商品详情
   *
   * @param kdtId
   * @param itemId
   * @returns {Promise<*>}
   */
  getById(kdtId, itemId) {
    return this.invoke('getById', [
      {
        kdtId,
        itemId,
      },
    ]);
  }

  /**
   * 批量获取商品 alias
   *
   * @param kdtId
   * @param itemIds
   * @returns {Promise<void>}
   */
  async listItemAlias(kdtId, itemIds) {
    const { items } = await this.invoke('listItemDetails', [{ kdtId, itemIds }]);
    const result = {};
    items.forEach(item => (result[item.itemId] = item.alias));
    return result;
  }
}

module.exports = ItemQueryService;
