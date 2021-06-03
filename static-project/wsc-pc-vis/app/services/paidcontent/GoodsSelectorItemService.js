const BaseService = require('../base/BaseService');
const { CHANNELS, GOODS_TYPES, PCT_GROUPS } = require('../../constants/goods-selector');

/**
 */
class GoodsSelectorItemService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.mall.item.api.ItemQueryService';
  }

  /**
   * @param {*} kdtId
   * @param {*} itemIds
   */
  async getGoodsListByItemIds(kdtId, itemIds) {
    const params = {
      isDisplays: [0, 1],
      channel: 0,
      containItemMark: false,
      itemIds,
      kdtId,
      page: 1,
      pageSize: 20,
      queryOption: {
        containsProductAttributesDefined: false,
        withCardAlias: false,
        withChannelExtra: false,
        withD30SoldNum: false,
        withFenxiaoAuth: false,
        withFenxiaoChangeInfo: false,
        withItemGroupDetail: false,
        withItemLock: false,
        withPreSaleType: false,
        withPvUv: false,
        withSkuSize: false,
        withStoreCount: false,
        withTotalSoldNum: false,
      },
    };
    return this.invoke('listItemsPaged', [params]);
  }

  /**
   * 获取商品列表
   *
   * @param {*} req
   */
  async getGoodsList(req) {
    const { kdtId, channel, type, group, keyword, page, pageSize } = req;
    const data = {
      kdtId,
      keyword,
      page: +page,
      pageSize: +pageSize,
      queryOption: {},
    };

    // 分销支持
    let isFx = false;
    if (channel !== CHANNELS.online) {
      isFx = true;
      data.itemTypes = [10];
      // 后端bug，查询实物商品的分销不能有 includeAbilityMars 和 notExcludeAbilityMarks
      if (type !== GOODS_TYPES.real) {
        data.includeAbilityMarks = [70001];
        data.notExcludeAbilityMarks = [70001];
      }
    } else {
      data.excludeAbilityMarks = [70001];
    }

    // type处理
    if (group && group !== 'all') {
      data.groupIds = [group];
    }

    switch (type) {
      case GOODS_TYPES.knowledge: {
        data.itemTypes = [31];
        data.itemTypesNotExclude = [31];
        // 知识付费类型必须有明确的group，不支持all 或 空
        const defaultGroup = PCT_GROUPS.column.groupId;
        data.owlItemTypes = [group];
        if (!group || group === 'all') {
          data.owlItemTypes = [defaultGroup];
        }
        delete data.groupIds;
        break;
      }
      case GOODS_TYPES.real:
        data.itemTypes = isFx ? [10] : [0];
        data.isVirtuals = [0];
        break;
      case GOODS_TYPES.virtual:
        data.isVirtuals = [2];
        data.itemTypes = [0];
        if (isFx) return { items: [], paginator: { page: 1, pageSize: 5, totalCount: 0 } };
        break;
      default:
        break;
    }

    return this.invoke('listItemsPaged', [data]);
  }
}

module.exports = GoodsSelectorItemService;
