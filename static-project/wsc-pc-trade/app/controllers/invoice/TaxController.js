const BaseController = require('./InvoiceBaseController');
const SellerTaxClsInfoQueryService = require('../../services/trade/invoice/SellerTaxClsInfoQueryService');
const TaxClassCodeQueryService = require('../../services/trade/invoice/TaxClassCodeQueryService');
const SellerTaxClsOperateService = require('../../services/trade/invoice/SellerTaxClsOperateService');
const ItemQueryService = require('../../services/ic/ItemQueryService');
const ItemOperateService = require('../../services/ic/ItemOperateService');

const map = require('lodash/map');

const ITEMS_LIMIT = 50;

/**
 * 税号编码相关
 */
class TaxController extends BaseController {
  get sellerTaxClsInfoQueryService() {
    return this.getCacheService(SellerTaxClsInfoQueryService);
  }

  get sellerTaxClsOperateService() {
    return this.getCacheService(SellerTaxClsOperateService);
  }

  get taxClassCodeQueryService() {
    return this.getCacheService(TaxClassCodeQueryService);
  }

  get itemQueryService() {
    return this.getCacheService(ItemQueryService);
  }

  get itemOperateService() {
    return this.getCacheService(ItemOperateService);
  }

  /**
   * 获取税收分类编码根列表节点数组
   * @param {AstroboyContext} ctx
   */
  async getTaxClassRootNodes(ctx) {
    const result = await this.taxClassCodeQueryService.getTaxClassRootNodes();
    return ctx.successRes(result);
  }

  /**
   * 获取税收编码子类节点列表
   * @param {AstroboyContext} ctx
   */
  async getTaxClassLeafNodesByParentCode(ctx) {
    const query = ctx.getQueryData();
    const result = await this.taxClassCodeQueryService.getTaxClassLeafNodesByParentCode(query.id);
    return ctx.successRes(result);
  }

  /**
   * 根据税收编码类型分页查询税收编码
   * @param {AstroboyContext} ctx
   */
  async getNodesByPrefixClsCodeJson(ctx) {
    const query = ctx.getQueryData();
    const result = await this.taxClassCodeQueryService.getNodesByPrefixClsCode({
      taxClassCode: query.id,
      pageSize: query.pageSize,
      pageNo: query.pageNo,
    });
    return ctx.successRes(result);
  }

  /**
   * 根据关键字分页查询税收编码
   * @param {AstroboyContext} ctx
   */
  async getTaxClassLeafByKeywordJson(ctx) {
    const query = ctx.getQueryData();
    const result = await this.taxClassCodeQueryService.getLeafNodesByKeyWord(query); // safe done 无入参
    return ctx.successRes(result);
  }

  /**
   * 根据编码数字分页查询税收编码
   * @param {AstroboyContext} ctx
   */
  async getTaxClassLeafByCodeJson(ctx) {
    const query = ctx.getQueryData();
    const result = await this.taxClassCodeQueryService.getLeafNodesByTaxClassCode({
      taxClassCode: query.keyword,
      pageNo: query.p || 1,
    });
    return ctx.successRes(result);
  }

  /**
   * 通过 code 查询该店铺的某个自定义收税分类编码
   * @param {AstroboyContext} ctx
   */
  async getSellerTaxClassByCodeJson(ctx) {
    const query = ctx.getQueryData();
    const { kdtId } = ctx;
    const result = await this.sellerTaxClsInfoQueryService.getSellerTaxClassByCode(
      kdtId,
      query.code,
    );
    return ctx.successRes(result);
  }

  /**
   * 分页查询自定义税收分类编码
   * @param {AstroboyContext} ctx
   */
  async getSellerTaxClassByPageJson(ctx) {
    const query = ctx.getQueryData();
    const pageNo = query.pageNo || 1;
    const pageSize = query.pageSize || 20;
    const result = await this.sellerTaxClsInfoQueryService.getSellerTaxClassByPage({
      ...query,
      kdtId: ctx.originQuery.kdtId || ctx.kdtId,  // safe done
      pageNo,
      pageSize,
    });
    return ctx.successRes(result);
  }

  /**
   * 添加自定义税收分类编码
   * @param {AstroboyContext} ctx
   */
  async postSellerTaxClassInfoJson(ctx) {
    const { kdtId } = this.ctx;
    const postData = ctx.getPostData();
    const result = await this.sellerTaxClsOperateService.addSellerTaxClassInfo({
      ...postData,
      kdtId,
      operatorId: this.operator.operatorId,
    });
    return ctx.successRes(result);
  }

  /**
   * 修改自定义税收分类编码
   * @param {AstroboyContext} ctx
   */
  async putSellerTaxClassInfoJson(ctx) {
    const { kdtId } = this.ctx;
    const postData = ctx.getPostData();
    const result = await this.sellerTaxClsOperateService.modifySellerTaxClassInfo({
      ...postData,
      kdtId,
      operatorId: this.operator.operatorId,
    });
    return ctx.successRes(result);
  }

  /**
   * 删除税收分类编码，需要后端修改为一个接口
   * TODO: 后端聚合
   * @param {AstroboyContext} ctx
   */
  async deleteSellerTaxClassInfoJson(ctx) {
    const { kdtId } = ctx;
    const postData = ctx.getPostData();
    const shopGoods = await this.itemQueryService.listItemsPaged(
      this.mergeInvoiceListItemsPagedParam({
        pageSize: 300,
        hasTaxClassCode: true,
        includeTaxClassCode: [postData.code],
        channel: 1,
      }),
    );
    const storeGoods = await this.itemQueryService.listItemsPaged(
      this.mergeInvoiceListItemsPagedParam({
        pageSize: 300,
        hasTaxClassCode: true,
        includeTaxClassCode: [postData.code],
        channel: 0,
      }),
    );
    let goods = [];
    if (shopGoods.items && shopGoods.items.length > 0) {
      goods = goods.concat(shopGoods.items);
    }
    if (storeGoods.items && storeGoods.items.length > 0) {
      goods = goods.concat(storeGoods.items);
    }
    // 如果商品编码下有商品需要先把商品删掉
    if (goods.length > 0) {
      const itemIds = map(goods, item => item.id);
      this.chunkUpdate(itemIds, ITEMS_LIMIT, async items => {
        await this.itemOperateService.updateTaxClassCode({
          kdtId,
          itemIds: items,
          taxClassCode: '',
        });
      });
    }
    const result = await this.sellerTaxClsOperateService.deleteSellerTaxClassInfo({
      taxClassCode: postData.code,
      kdtId,
      operatorId: this.operator.operatorId,
    });
    return ctx.successRes(result);
  }

  /**
   * 分批更新商品的税收分类编码
   * TODO: 需要后端聚合
   * @param {AstroboyContext} ctx
   */
  async postUpdateGoodsTaxClassCodeJson(ctx) {
    const { kdtId } = ctx;
    const { add, del, code } = ctx.getPostData();
    if (add && add.length > 0) {
      await this.chunkUpdate(add, ITEMS_LIMIT, async items => {
        await this.itemOperateService.updateTaxClassCode({
          kdtId,
          itemIds: items,
          taxClassCode: code,
        });
      });
    }
    if (del && del.length > 0) {
      await this.chunkUpdate(del, ITEMS_LIMIT, async items => {
        await this.itemOperateService.updateTaxClassCode({
          kdtId,
          itemIds: items,
          taxClassCode: '',
        });
      });
    }
    return ctx.successRes();
  }

  /**
   * 新增商家自定义运费税收分类信息
   * @param {AstroboyContext} ctx
   */
  async addFreightTax(ctx) {
    const { kdtId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      operatorId: this.operator.operatorId,
    };
    const result = await this.sellerTaxClsOperateService.addSellerFreightTaxClassInfo(params);
    return ctx.successRes(result);
  }

  /**
   * 修改运费自定义税收分类编码
   * @param {AstroboyContext} ctx
   */
  async updateFreightTax(ctx) {
    const { kdtId } = this.ctx;
    const postData = ctx.getPostData();
    const result = await this.sellerTaxClsOperateService.modifySellerFreightTaxClassInfo({
      ...postData,
      kdtId,
      operatorId: this.operator.operatorId,
    });
    return ctx.successRes(result);
  }

  /**
   * 查询商家设置的运费编码及税率
   * @param {AstroboyContext} ctx
   */
  async getFreightTax(ctx) {
    const { kdtId } = ctx;
    const result = await this.sellerTaxClsInfoQueryService.queryFreightTax(kdtId);
    return ctx.successRes(result);
  }

  /**
   * 分批操作
   * @param {string[]} items
   * @param {number} limit
   * @param {Function} callback
   */
  async chunkUpdate(items, limit, callback) {
    for (let i = 0; i < items.length; i += limit) {
      await callback(items.slice(i, i + limit));
    }
  }
}

module.exports = TaxController;
