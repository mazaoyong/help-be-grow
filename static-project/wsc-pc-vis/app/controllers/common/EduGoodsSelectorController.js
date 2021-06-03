const BaseController = require('../base/BaseController');
const GoodsSelectorConfigService = require('../../services/ump/manage/GoodsSelectorConfigService');
const IcItemQueryService = require('../../services/api/ic/service/ItemQueryService');
const IcItemGroupManageService = require('../../services/api/ic/service/ItemGroupManageService');

const GoodsSelectorEduItemService = require('../../services/owl/ic/aggregate/OwlProductAggregateFacade');

// SKU 组件需要的固定前缀
const SKU_PREFIX = 'IFWEN2234_N3K_32R2';

class EduGoodsSelectorController extends BaseController {
  // 商品列表分页接口（实际化接口，需要后端配置）
  async fetchGoods(ctx) {
    const { kdtId, query } = ctx;
    const { activityType, activityId } = query;

    const params = {
      pageNo: +query.pageNo,
      pageSize: +query.pageSize,
      shopId: ctx.kdtId,
      keyword: query.keyword,
      goodsChannel: query.channel === 'online' ? 'ONLINE' : 'OFFLINE',
    };
    if (typeof query.type === 'string' && query.type.length > 0) {
      params.goodsClusterType = query.type.toUpperCase();
    }
    if (query.group && query.group.toUpperCase() !== 'ALL') {
      if (String(query.type).toUpperCase() === 'KNOWLEDGE') {
        params.knowledgeGoodsType = String(query.group).toUpperCase();
      } else {
        params.goodsGroupId = +query.group;
      }
    }
    if (+activityId) {
      params.activityId = +activityId;
    }

    this.validator.isNumeric(activityType, 'activityType 必须是数字');
    params.umpType = +activityType;

    const { items = [], ...result } = await new GoodsSelectorConfigService(ctx).queryGoodsList(
      params,
    );

    const list = items.map((item) => ({
      goodsName: item.goodsName,
      goodsInventory: item.goodsInventory, // 商品库存
      goodsGroupList: item.goodsGroupList,
      goodsId: item.goodsId,
      goodsPrice: item.goodsPrice,
      goodsImage: item.goodsPic,
      goodsDesc: item.goodsNo || '',
      goodsDetailUrl: item.goodsDetailUrl || '',
      goodsSales: item.goodsSales === undefined ? '-' : item.goodsSales,
      goodsLabelList: item.goodsLabelList,
      joinActivityList: item.joinActivityVOList,
      optional: item.optional, // 商品是否可选
      notOptionalReason: item.notOptionalReason, // 不可选原因
    }));

    if (query.isSkuMode === 'true' && list.length > 0) {
      const itemIds = list.map((item) => item.goodsId);
      // 查询商品 sku 信息
      let skuInfoList = [];
      skuInfoList = await new IcItemQueryService(ctx).listItemWithSortedSku(kdtId, itemIds);
      const goodsSkuMap = this.getMappedSkuList(skuInfoList);
      list.forEach((item) => {
        // 附上 sku 信息
        item.skuInfo = goodsSkuMap[item.goodsId];
        item.isSku = item.skuInfo ? item.skuInfo.sku.length > 0 : false;
      });
    }

    ctx.success({ ...result, items: list });
  }

  // 构造多 SKU 商品的数据结构
  getMappedSkuList(items, itemIdsToGoodsTypeMap = {}) {
    const skuListMap = {};

    /**
     * 生成 SKU 具体的信息
     *
     * @param item
     * @return {{skuId: *, stock: *}}
     */
    function generateSkuItem(item) {
      const currentSku = JSON.parse(item.sku);
      const usedSku = currentSku.length ? currentSku : [];
      const ret = {
        skuId: item.id,
        stock: item.channel === 0 ? item.stockNum : item.stockNum / 1000,
        price: item.price,
      };
      if (itemIdsToGoodsTypeMap[item.itemId] === 10) {
        ret.canSelect = item.isSell !== 0;
      }

      usedSku.forEach((sku) => {
        ret[`${SKU_PREFIX}${sku.k_id}`] = sku.v;
      });
      ret.skuDetail = usedSku.map(sku => sku.v).join(' ');

      return ret;
    }

    /**
     * 生成 SKU 规格信息
     *
     * @param item
     * @return {*}
     */
    function generateSkuSpec(item) {
      const skuSpecs = JSON.parse(item.sku);
      return skuSpecs.map((sku) => {
        return {
          _id: sku.k_id,
          text: sku.k,
          spec: Object.values(sku.values).map((value) => {
            return {
              text: value,
            };
          }),
        };
      });
    }

    items.forEach((item) => {
      if (skuListMap[item.itemId]) {
        const sku = skuListMap[item.itemId].sku;
        sku.push(generateSkuItem(item));
        skuListMap[item.itemId].sku = sku;
      } else {
        // 第 0 个，需要传 sku 规格的数组
        skuListMap[item.itemId] = {
          id: item.id,
          columns: generateSkuSpec(item),
          sku: [],
        };
      }
    });

    return skuListMap;
  }

  // 获取商品选择组件配置
  async getGoodsSelectorConfig(ctx) {
    const config = await new GoodsSelectorConfigService(ctx).queryGoodsSelectorConfig({
      shopId: ctx.kdtId,
      ...ctx.query,
    });
    ctx.success(config);
  }

  // 将字符串 type 翻译成数字 type
  getSubType(type, group) {
    let subType = 0;
    let mediaType;
    if (type !== 'KNOWLEDGE') {
      return { subType, mediaType };
    }

    switch (group) {
      case 'OFFLINE_COURSE':
        subType = 10;
        break;
      case 'COLUMN':
        subType = 1;
        break;
      case 'CONTENT':
        subType = 2;
        break;
      case 'contentText':
        subType = 2;
        mediaType = 1;
        break;
      case 'contentAudio':
        subType = 2;
        mediaType = 2;
        break;
      case 'contentVideo':
        subType = 2;
        mediaType = 3;
        break;
      case 'LIVE':
        subType = 4;
        break;
    }

    return { subType, mediaType };
  }

  // 只适合于单纯选择教育商品的商品列表分页接口
  async getEduGoodsListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    const reqForEdu = {
      channel: 0, // 非分销商品
      keyword: req.keyword,
      ...this.getSubType(req.type, req.group),
    };

    // 0 代表在售 2 代表全部
    const { showSoldOut = 0 } = req;
    reqForEdu.showSoldOut = +showSoldOut;

    typeof req.mediaType !== 'undefined' && (reqForEdu.mediaType = req.mediaType);
    const pageRequest = {
      pageNumber: req.pageNo,
      pageSize: req.pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
    };

    const result = await new GoodsSelectorEduItemService(ctx).findOwlWithCourseProduct(
      kdtId,
      pageRequest,
      reqForEdu,
    );

    const compatResult = {
      items: result.content.map((item) => {
        return {
          goodsAlias: item.alias,
          goodsDetailUrl: item.url,
          goodsGroupList: [],
          goodsId: item.productId,
          goodsImage: item.cover,
          goodsInventory: item.totalStock || 0, // .. ?
          owlItemType: item.type,
          owlSellerType: item.sellerType, // 销售模式
          isFree: !!item.isFree,
          goodsLabelList: [],
          goodsName: item.title,
          goodsPrice: item.price,
          goodsSales: item.subscriptionCount,
          joinActivityList: [],
          notOptionalReason: [],
          optional: true,
        };
      }),
      paginator: {
        page: result.pageable.pageNumber,
        pageSize: result.pageable.pageSize,
        totalCount: result.total,
      },
    };

    // 带上 sku 信息
    if (req.isSkuMode === 'true' && compatResult.items.length > 0) {
      const itemIds = compatResult.items.map((item) => item.goodsId);
      // 查询商品 sku 信息
      let skuInfoList = [];
      skuInfoList = await new IcItemQueryService(ctx).listItemWithSortedSku(kdtId, itemIds);
      const goodsSkuMap = this.getMappedSkuList(skuInfoList);
      compatResult.items.forEach((item) => {
        // 附上 sku 信息
        item.skuInfo = goodsSkuMap[item.goodsId];
        item.isSku = item.skuInfo ? item.skuInfo.sku.length > 0 : false;
      });
    }

    ctx.json(0, 'ok', compatResult);
  }

  // 获取商品分组筛选项
  async fetchFilterGroups(ctx) {
    const { kdtId, query } = ctx;
    const params = {
      kdtId,
      isDefault: 0,
      page: +query.pageNo,
      pageSize: +query.pageSize,
      title: query.keyword,
      includePromotionGroup: false,
      channel: query.channel === 'online' ? 0 : 1,
    };

    const data = await new IcItemGroupManageService(ctx).queryUpperGroup(params);
    ctx.json(0, 'ok', data);
  }
}

module.exports = EduGoodsSelectorController;
