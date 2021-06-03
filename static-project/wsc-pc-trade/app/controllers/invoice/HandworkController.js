const BaseController = require('./InvoiceBaseController');
const ItemQueryService = require('../../services/ic/ItemQueryService');
const InvoiceOperateService = require('../../services/trade/invoice/InvoiceOperateService');
const OrderInvoiceInfoQueryService = require('../../services/trade/invoice/OrderInvoiceInfoQueryService');
const SellerTaxClsInfoQueryService = require('../../services/trade/invoice/SellerTaxClsInfoQueryService');
const GoodChannel = require('../../constants/GoodChannel');
const OrderDetailService = require('../../services/trade/detail/OrderDetailService');
const OrderInfoService = require('../../services/trade/detail/OrderInfoService');
const InvoiceQueryService = require('../../services/trade/invoice/InvoiceQueryService');
const { appName } = require('../../constants');

const _find = require('lodash/find');
const _has = require('lodash/has');

const GOODS_CHANNEL = {
  online: 'online',
  offline: 'offline',
};

/**
 * 手工开票
 */
class HandworkController extends BaseController {
  get itemQueryService() {
    return this.getCacheService(ItemQueryService);
  }

  get orderInfoService() {
    return this.getCacheService(OrderInfoService);
  }

  get orderDetailService() {
    return this.getCacheService(OrderDetailService);
  }

  get invoiceQueryService() {
    return this.getCacheService(InvoiceQueryService);
  }

  get invoiceOperateService() {
    return this.getCacheService(InvoiceOperateService);
  }

  get orderInvoiceInfoQueryService() {
    return this.getCacheService(OrderInvoiceInfoQueryService);
  }

  get sellerTaxClsInfoQueryService() {
    return this.getCacheService(SellerTaxClsInfoQueryService);
  }

  /**
   * 获取可手工开票（有税号的）商品列表
   * @param {AstroboyContext} ctx
   */
  async handworkGoodsList(ctx) {
    const query = ctx.getQueryData();
    const req = {
      page: query.page,
      pageSize: query.pageSize,
      hasTaxClassCode: true,
      itemTypesNotExclude: [31],
      channel: query.channel === GOODS_CHANNEL.online ? GoodChannel.online : GoodChannel.offline,
      keyword: query.keyword ? query.keyword : null,
    };
    const result = await this.itemQueryService.listItemsPaged(
      this.mergeInvoiceListItemsPagedParam(req),
    );
    // 聚合加入taxRate
    await this.setTaxRate(result);
    return ctx.successRes(result);
  }

  /**
   * 获取手工开票订单的商品信息列表
   * @param {AstroboyContext} ctx
   */
  async handworkOrderDetail(ctx) {
    const { orderNo } = ctx.getQueryData();
    const { kdtId } = this.ctx;
    // 先校验订单支不支持开票
    const result = await this.orderInvoiceInfoQueryService.queryOrderInvoiceInfo(orderNo, {
      isCheckAllowInvoice: true,
      isSeller: true /** b端不做限制，加字段传参 */,
    });
    const { bizNo, orderInvoiceAbilityDTO = {} } = result;
    const { isAllowInvoice = false, orderItemInvoiceAbilityMap = {} } = orderInvoiceAbilityDTO;

    // 可以开票且存在商品
    if (isAllowInvoice && result.items && result.items.length) {
      // 过滤不可开票商品
      result.items = result.items.filter(item => {
        const invoiceAbilityTarget = orderItemInvoiceAbilityMap[item.id] || {};
        if (!invoiceAbilityTarget.isAllowInvoice) {
          result.hasUnavaliableGoods = true;
        }
        return invoiceAbilityTarget.isAllowInvoice || false;
      });

      // 查询订单
      const params = {
        kdtId,
        orderNos: [orderNo],
        app: appName,
        bizGroup: 'ump',
        options: {
          withItemInfo: true,
          withPaymentInfo: true,
        },
      };
      const orderDetailResult = (await this.orderDetailService.getOrders(params))[0];
      if (orderDetailResult && orderDetailResult.itemInfo && orderDetailResult.itemInfo.length) {
        result.items.forEach(item => {
          const target = _find(orderDetailResult.itemInfo, { goodsId: item.goodsId });
          // 设置图片 url
          if (target) {
            const goodsInfo = JSON.parse(target.goodsInfo);
            item.imgUrl = goodsInfo.img_url;
          }
        });
      }

      // 填充用户输入的开票信息
      if (_has(orderDetailResult, 'mainOrderInfo.extra.INVOICE')) {
        result.initInvoiceInfo = orderDetailResult.mainOrderInfo.extra.INVOICE;
      }

      // 检查是否有失败发票记录（失败的情况下手工开票会删除之前的失败记录），并设置对应标识
      const orderInvoices =
        (await this.invoiceQueryService.queryInvoiceByBizNo(bizNo, {
          includeInvoiceHeader: false,
          includeInvoiceDetail: false,
        })) || [];
      result.hasFailedInvoice = orderInvoices.some(invoice => invoice.status === 20);
    }
    return ctx.successRes(result);
  }

  /**
   * 为商品列表中的商品添加税率信息字段
   * TODO: 聚合
   */
  async setTaxRate(result) {
    const ctx = this.ctx;
    const query = ctx.originQuery;
    const kdtId = query.kdtId || ctx.kdtId;
    // 聚合加入taxRate
    if (result.items && result.items.length) {
      const codes = [];
      // 提取所有的收税分类编码
      result.items.forEach(item => {
        const taxClassCode = item.taxClassCode || item.taxClsCode;
        if (taxClassCode && codes.indexOf(taxClassCode) === -1) {
          codes.push(taxClassCode);
        }
      });
      if (codes.length === 0) {
        return ctx.successRes(result);
      }
      // 查询收税分类编码
      const taxClassResult = await this.sellerTaxClsInfoQueryService.getTaxClassByCodeList(
        kdtId,
        codes,
      );
      if (taxClassResult && taxClassResult.length) {
        result.items.forEach(item => {
          const taxClassCode = item.taxClassCode || item.taxClsCode;
          const target = _find(taxClassResult, { taxClassCode }) || {};
          item.taxRate = target.taxRate;
          item.zeroRateIdentify = target.zeroRateIdentify;
        });
      }
    }
  }

  /**
   * 确认手工开票
   * @param {AstroboyContext} ctx
   */
  async createManualInvoice(ctx) {
    const { extension, ...invoiceEntity } = ctx.getPostData();
    const result = await this.invoiceOperateService.manualInvoiceApply({
      ...invoiceEntity,
      kdtId: ctx.kdtId,
      redInvoice: false,
      auto: false,
      type: 1,
      requestId: this.requestId,
      extension: Object.assign(
        {
          operator: this.operator,
          source: {
            clientIp: ctx.firstXff,
            fromApp: appName,
            source: 0,
          },
        },
        extension,
      ),
    });
    return ctx.successRes(result);
  }
}

module.exports = HandworkController;
