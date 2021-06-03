const BaseController = require('./InvoiceBaseController');
const OfflineProductSearchApiService = require('../../services/retail/OfflineProductSearchApi');
const CategoryApiService = require('../../services/retail/CategoryApiService');
const ItemGroupService = require('../../services/ic/ItemGroupService');
const ItemQueryService = require('../../services/ic/ItemQueryService');
const GoodsSelectorConfigService = require('../../services/ump/GoodsSelectorConfigService');
const ItemGroupManageService = require('../../services/ic/ItemGroupManageService');
const QiniuFileWriteService = require('../../services/material/materialcenter/StorageQiniuFileWriteService');
const GoodsImportService = require('../../services/ump/GoodsImportService');
const formatDate = require('@youzan/utils/date/formatDate').default;
const { checkBranchStore } = require('@youzan/utils-shop');
const chunk = require('lodash/chunk');
const _flatten = require('lodash/flatten');

const GOODS_CHANNEL = {
  online: 'online',
  offline: 'offline',
};

const NODE_ENV = global.process.env.NODE_ENV;
const PAGE_SIZE_LIMIT = ['pre', 'prod'].indexOf(NODE_ENV) > -1 ? 120 : 60;

// 商品导入，文件上传最大限制
const MAX_FILE_UPLOAD_SIZE = 10 * 1024 * 1024;

// 商品导入任务状态对应的文案
const IMPORT_TASK_STATUS_TEXT = {
  0: '',
  1: '',
  2: '导入成功',
  3: '部分导入成功',
  4: '导入失败',
};

// 请求商品详情接口 数据列表拆分
const GOODS_CHUNK_NUM = 49;

// 营销内部标记，302为电子发票类型
const UMP_TYPE = 302;

/**
 * 商品数据结构适配器
 *
 * @param {*} result
 */
function adapterOnlineGoods(result) {
  for (const item of result.items) {
    const picture = item.picture && JSON.parse(item.picture);
    if (picture && picture.length) {
      item.photoUrl = picture[0].url;
    } else {
      item.photoUrl = '';
    }
  }
}

/**
 * 商品数据结构适配器
 *
 * @param {*} result
 */
function adapterOfflineGoods(result) {
  for (const item of result.items) {
    item.taxClassCode = item.taxCode;
    item.id = item.itemId;
  }
}

/**
 * 商品查询
 */
class GoodsController extends BaseController {
  get offlineProductSearchApiService() {
    return this.getCacheService(OfflineProductSearchApiService);
  }

  get categoryApiService() {
    return this.getCacheService(CategoryApiService);
  }

  get itemQueryService() {
    return this.getCacheService(ItemQueryService);
  }

  get itemGroupService() {
    return this.getCacheService(ItemGroupService);
  }

  /**
   * 查询商品分组
   * @param {AstroboyContext} ctx
   */
  async goodsGroup(ctx) {
    const { kdtId, userId } = this.ctx;
    const query = ctx.getQueryData();
    if (query.channel === GOODS_CHANNEL.offline) {
      // 零售商品分组查询
      const categoryParams = {
        kdtId,
        adminId: userId,
        retailSource: 'invoice',
      };
      const result = await this.categoryApiService.queryCategories(categoryParams);
      return ctx.successRes(result);
    } else {
      const result = await this.itemGroupService.queryGroups({ kdtId });
      return ctx.successRes(result);
    }
  }

  /**
   * 查询商品
   * @param {AstroboyContext} ctx
   */
  async searchGoods(ctx) {
    const { kdtId, userId: adminId } = this.ctx;
    const query = ctx.getQueryData();
    let result;
    if (query.channel === GOODS_CHANNEL.offline) {
      // 查询门店商品
      result = await this.offlineProductSearchApiService.search({
        kdtId,
        adminId,
        retailSource: 'invoice',
        isDisplays: [0, 1],
        showSoldOut: 2,
        categoryIds: query.groupId ? [query.groupId] : null,
        nameOrSkuNo: query.keyword ? query.keyword : null,
        pageNo: query.pageNo,
        pageSize: query.pageSize,
      });
      adapterOfflineGoods(result);
    } else {
      // 查询网店商品
      result = await this.itemQueryService.listItemsPaged(
        this.mergeInvoiceListItemsPagedParam({
          kdtId,
          groupIds: query.groupId ? [query.groupId] : null,
          keyword: query.keyword,
          page: query.pageNo,
          pageSize: query.pageSize,
          channel: 0,
          // 过滤分销商品
          itemTypesExclude: [10],
          excludeAbilityMarks: [70001],
        }),
      );
      adapterOnlineGoods(result);
    }
    result.count = result.paginator.totalCount;
    return ctx.successRes(result);
  }

  /**
   * 获取未配置自定义分类税收编码啊的商品数量
   * @param {AstroboyContext} ctx
   */
  async getNoTaxClassGoodsCountJson(ctx) {
    const { kdtId } = ctx;
    const shopReq = this.itemQueryService.listItemsPaged(
      this.mergeInvoiceListItemsPagedParam({
        hasTaxClassCode: false,
        channel: 1,
      }),
    );
    // 获取当前店铺下所有的已配置编码的网店商品数量
    const storeReqWithTax = this.itemQueryService.countByTaxClassCodes({
      kdtId,
      canal: 0, // 网店
      taxClassCodes: [''], // 所有商品
    });
    const storeReq = this.itemQueryService.listItemsPaged(
      this.mergeInvoiceListItemsPagedParam({
        hasTaxClassCode: false,
        channel: 0,
      }),
    );

    const [shopResponse, storeResponse, storeResponseWithTax] = await Promise.all([
      shopReq,
      storeReq,
      storeReqWithTax,
    ]);

    const shopCount =
      shopResponse && shopResponse.paginator ? shopResponse.paginator.totalCount : 0;
    const storeCount =
      storeResponse && storeResponse.paginator ? storeResponse.paginator.totalCount : 0;
    const storeCountWithTax = storeResponseWithTax[''] || 0;

    const result = {
      shopCount,
      storeCount,
      storeCountWithTax,
    };
    return ctx.successRes(result);
  }

  /**
   * 获取某个税收分类编码下的所有商品信息
   * @param {AstroboyContext} ctx
   */
  async getTaxClassGoodsListJson(ctx) {
    const query = ctx.getQueryData();
    const channel = query.channel;
    const req = {
      page: 1,
      pageSize: PAGE_SIZE_LIMIT,
      hasTaxClassCode: true,
      includeTaxClassCode: [query.code],
      channel: channel === GOODS_CHANNEL.online ? 0 : 1,
    };
    // 按实际数量分次调用，每次300条，返回所有数量
    const result = await this.paginateTaxClassGoodsList(req);
    return ctx.successRes(result);
  }

  /**
   * 分批查询商品信息，并将其组合
   * TODO: 后端聚合
   */
  async paginateTaxClassGoodsList(req) {
    const result = await this.itemQueryService.listItemsPaged(
      this.mergeInvoiceListItemsPagedParam(req),
    );
    if (result.paginator && result.paginator.totalCount > PAGE_SIZE_LIMIT) {
      const times = Math.ceil(result.paginator.totalCount / PAGE_SIZE_LIMIT);
      const reqList = [];
      for (let time = 2; time <= times; time++) {
        const timedReq = Object.assign({}, req, {
          page: time,
        });
        reqList.push(
          this.itemQueryService.listItemsPaged(this.mergeInvoiceListItemsPagedParam(timedReq)),
        );
      }
      const resList = await Promise.all(reqList);
      for (const res of resList) {
        if (res.items && res.items.length) {
          result.items = result.items.concat(res.items);
        }
      }
    }
    return result;
  }

  /**
   * 返回GoodsSelectorV2需要的商品列表
   */
  async fetchGoods(ctx) {
    const query = ctx.getQueryData();
    const { taxClassCode, sourceShop, ...other } = query;

    const params = {
      pageNo: +query.pageNo,
      pageSize: +query.pageSize,
      shopId: ctx.kdtId,
      keyword: query.keyword,
      goodsChannel: query.channel === GOODS_CHANNEL.online ? 'ONLINE' : 'OFFLINE',
      umpType: UMP_TYPE,
      extraMap: { TAX_CLASS_CODE: taxClassCode || '-' },
      ...other, // safe done 无需 kdtId, 上文用的 shopId: ctx.kdtId
    };
    if (query.type && query.type !== 'all') {
      params.goodsClusterType = query.type;
    }
    if (query.group && query.group !== 'all') {
      if (query.type === 'KNOWLEDGE') {
        params.knowledgeGoodsType = query.group;
      } else {
        params.goodsGroupId = +query.group;
      }
    }
    // shop 为 '0' 表示全部店铺
    if (sourceShop && sourceShop !== 'all') {
      params.goodsSourceShopId = +sourceShop;
    }

    let goodsItems = [];
    let result = {};
    const { items = [], ...others } = await new GoodsSelectorConfigService(ctx).queryGoodsList(
      params,
    );
    goodsItems = items;
    result = others;

    const list = goodsItems.map(item => {
      const { goodsPic, goodsNo = '', goodsPrice, goodsName = '', ...otherParams } = item;
      return {
        ...otherParams,
        goodsNo,
        goodsDesc: goodsNo, // 商品编码
        photoUrl: goodsPic,
        sourceShop: (item.goodsSourceShopModel && item.goodsSourceShopModel.shopDisplayName) || '', // 店铺渠道
        channel: query.channel,
        price: goodsPrice,
        title: goodsName,
      };
    });
    const finalResult = { ...result, items: list };
    return ctx.successRes(finalResult);
  }

  /**
   * 获取商品分组筛选项
   */
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

    const shopInfo = ctx.getState('shopInfo');
    const rootKdtId = shopInfo.rootKdtId || kdtId;

    // 跟 sourceShop 筛选框联动
    if (query.sourceShop !== null && query.sourceShop !== 'all' && +query.sourceShop !== 0) {
      const isNoEqualRoot = +query.sourceShop !== +rootKdtId;

      // 分店，合伙人只返回自建商品分组
      if (isNoEqualRoot) {
        params.kdtId = +query.sourceShop;
        delete params.includePromotionGroup;
        params.type = 2;
      } else {
        // 看总部分配到当前店铺的分组
        params.kdtId = ctx.kdtId;
        params.type = 0;
      }
    }
    const data = await new ItemGroupManageService(ctx).queryUpperGroup(params);
    return ctx.successRes(data);
  }

  getUserInfo(ctx) {
    const { kdtId } = ctx;
    const { id, ...userOtherInfo } = ctx.getLocalSession('userInfo');

    this.validator.required(id, '获取用户数据失败').required(kdtId, '获取店铺数据失败');
    return {
      kdtId,
      userId: id,
      id,
      ...userOtherInfo,
    };
  }

  /**
   * 获取上传文件需要的 token
   */
  async postToken(ctx) {
    const { id: operatorId } = this.getUserInfo(ctx);
    const result = await new QiniuFileWriteService(ctx).getPublicFileUploadToken({
      channel: 'goods-selector',
      fromApp: 'wsc-pc-ump',
      ip: ctx.firstXff,
      maxSize: MAX_FILE_UPLOAD_SIZE,
      operatorType: 1,
      operatorId,
    });

    const { uploadToken } = result;

    ctx.json(0, 'ok', { uptoken: uploadToken || '' });
  }

  /**
   * 获取已导入记录列表
   */
  async getImportedList(ctx) {
    const { pageNo, pageSize } = ctx.query;
    const result = await new GoodsImportService(ctx).findFileLists({
      pageNo,
      pageSize,
      appType: UMP_TYPE,
      kdtId: ctx.kdtId,
    });
    const items = result.umpImportTaskModelVOS.map(item => {
      const { sourceUrl = '', failFileUrl = '', successNum = 0, failNum = 0 } = JSON.parse(
        item.snapshot || {},
      );

      const result = {
        id: item.id,
        activityName: item.activityName || '',
        activityUrl: item.editUrl || '',
        linkInValid: !item.canView,
        inValidReason: '该活动已删除',
        successNum,
        failedNum: failNum,
        fileName: item.name,
        fileUrl: sourceUrl,
        failedRecordUrl: failFileUrl,
        operatePersonName: item.nickName,
        importStatus: IMPORT_TASK_STATUS_TEXT[item.status],
        completeTime: formatDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss'),
      };

      return result;
    });

    ctx.json(0, 'ok', { items, total: result.total });
  }

  /**
   * 开始导入商品
   */
  async doImportGoods(ctx) {
    const { fileUrl, fileName, activityId, alreadyChosen, activityAttrs, taxClassCode } = ctx.query;
    const { mobile: operatorPhone } = this.getUserInfo(ctx);

    const params = {
      operatorId: ctx.userId,
      kdtId: ctx.kdtId,
      name: fileName,
      sourceUrl: fileUrl,
      appType: UMP_TYPE,
      alreadyChosen: +alreadyChosen || 0,
      snapshot: JSON.stringify({ operatorPhone }),
      attrs: { TAX_CLASS_CODE: taxClassCode || '-' },
    };

    if (activityId) {
      params.activityId = +activityId;
    }

    if (activityAttrs) {
      params.attrs = JSON.parse(activityAttrs);
    }

    const result = await new GoodsImportService(ctx).fileImport(params);

    ctx.json(0, 'ok', result);
  }

  /**
   * 查询商品导入状态
   */
  async checkImportStatus(ctx) {
    const { id } = ctx.query;
    const { realResult = [], status } = await new GoodsImportService(ctx).getResult({
      id,
      kdtId: ctx.kdtId,
    });

    const result = realResult.map(item => {
      const { g, s, ...other } = item;
      return {
        goodsId: g,
        skuId: s,
        ...other,
      };
    });

    ctx.json(0, 'ok', { status, result });
  }

  /**
   * 根据商品 ids 获取 商品详情，给商品导入使用
   */
  // 保证商品排序
  sortGoodsList(ctx, { list, goodsIds, baseKey = 'id' }) {
    const sortedList = [];
    goodsIds.forEach(id => {
      const pos = list.findIndex(i => i !== null && i[baseKey] === id);
      if (pos > -1) {
        sortedList.push(list[pos]);
        list.splice(pos, 1);
      }
    });

    return sortedList;
  }

  async _getPureGoodsByIds(ctx, goodsIds, kdtId = null) {
    if (!goodsIds || !goodsIds.length) {
      return [];
    }
    if (kdtId === null) {
      const shopInfo = ctx.getState('shopInfo');
      kdtId = checkBranchStore(shopInfo) ? shopInfo.rootKdtId : ctx.kdtId;
    }
    const idChunks = chunk(goodsIds, GOODS_CHUNK_NUM);
    const icItemQueryService = new ItemQueryService(ctx);

    const workArr = idChunks.map(ids =>
      icItemQueryService
        .listItemsWithIds({ kdtId, itemIds: ids, isNeedSlaveCreatedNormalBack: true })
        .catch(() => null),
    );

    const list = await Promise.all(workArr).then(resList => _flatten(resList));

    return this.sortGoodsList(ctx, { list, goodsIds });
  }

  async _getGoodsByIds(ctx, goodsIds, kdtId = null) {
    const list = await this._getPureGoodsByIds(ctx, goodsIds, kdtId);

    return list.map(item => ({
      ...item,
      goodsName: item.title,
      goodsId: item.id,
      channel: item.channel ? 'offline' : 'online',
    }));
  }

  async fetchImportedGoodsDetailByIds(ctx) {
    const {
      request: { body },
    } = ctx;
    const { ids, items = [] } = body;
    const { kdtId } = ctx.originBody;
    const goodsIds = ids || items.map(i => i.goodsId);
    const list = await this._getGoodsByIds(ctx, goodsIds, kdtId || ctx.kdtId); // safe done

    if (items) {
      list.forEach(goods => {
        const item = items.find(i => i.goodsId === goods.id);
        goods.importResult = item;
      });
    }
    return ctx.json(0, 'ok', list);
  }

  /**
   * 取消导入
   */
  async cancelImport(ctx) {
    const { id } = ctx.query;
    const result = await new GoodsImportService(ctx).cancelImport({
      id: +id,
    });
    ctx.json(0, 'ok', result);
  }

  /**
   * 确认导入
   */
  async sureImport(ctx) {
    const { id } = ctx.query;
    const result = await new GoodsImportService(ctx).importSure({
      id: +id,
      kdtId: ctx.kdtId,
    });
    ctx.json(0, 'ok', result);
  }
}

module.exports = GoodsController;
