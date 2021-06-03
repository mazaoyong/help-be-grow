const _ = require('lodash');
const BaseController = require('../base/BaseController');
const BatchRefundQueryService = require('../../services/rpbatch/BatchRefundQueryService');
const SellerRefundService = require('../../services/ebiz/SellerRefundService');
const BatchRefundOperateService = require('../../services/rpbatch/BatchRefundOperateService');
const ShopAddressService = require('../../services/shop/ShopAddressServiceV2');
const CountryCodeListService = require('../../services/shop/ShopAddressService');
const ShopAddressOuterService = require('../../services/shop/ShopAddressOuterService');
const RefundExportService = require('../../services/order/RefundExportService');
const ReturnOrderService = require('../../services/retail/ReturnOrderService');
const RefundFundFlowQueryService = require('../../services/refund/RefundFundFlowQueryService');
const utilsShop = require('@youzan/utils-shop');

/**
 * 批量处理退货退款各个操作对应的接口文档说明
 * https://doc.qima-inc.com/pages/viewpage.action?pageId=56268879#id-%E6%89%B9%E9%87%8F%E7%94%B3%E8%AF%B7%E5%A4%84%E7%90%86%E9%80%80%E6%AC%BE-%E8%AE%BE%E8%AE%A1-%E9%80%80%E8%B4%A7%E9%80%80%E6%AC%BE%E5%90%84%E4%B8%AA%E6%93%8D%E4%BD%9C%E5%AF%B9%E5%BA%94%E7%9A%84%E6%8E%A5%E5%8F%A3
 *
 */

class RefundsController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '售后维权';
  }

  async getIndexHtml(ctx) {
    await Promise.all([this.initStoreId(), this.initTeamAdmin(), this.initIsShowMultiStore()]);
    await ctx.render('refund/list.html');
  }

  async getRefundDetailHtml(ctx) {
    await ctx.render('refund/overview.html');
  }

  async getRefundList(ctx) {
    const { kdtId } = ctx;
    const shopInfo = ctx.getState('shopInfo');
    const {
      refundId,
      orderNo,
      phase,
      isInvolved,
      demand,
      extra,
      status,
      startTime,
      endTime,
      page = 1,
      pageSize = 20,
      goodsTitle,
      deliveryNo,
      deliveryStatus,
      orderType,
      subShopKdtId,
      refundDeliveryStatus,
      storeId,
      bizSource,
    } = ctx.query;

    const data = {
      kdtId,
      orderNo,
      refundId,
      phase: +phase,
      involvedStatus: +isInvolved,
      demand: +demand,
      searchTag: +extra,
      status: +status,
      pageNo: +page,
      goodsTitle,
      deliveryNo,
      deliveryStatus: +deliveryStatus,
      pageSize,
      type: 1, // 只显示买家申请退款
      storeId,
      bizSource,
    };

    const isHqStore = utilsShop.checkHqStore(shopInfo);
    const isPartnerStore = utilsShop.checkPartnerStore(shopInfo);

    // 如果是连锁总店或合伙人店铺 添加总店id及查询店铺列表
    if (isHqStore || isPartnerStore) {
      if (isPartnerStore) {
        // 如果是合伙人店铺 添加partnerKdtId
        data.partnerKdtId = kdtId;
      }
      data.headKdtId = shopInfo.rootKdtId;
      data.kdtIdList = +subShopKdtId ? [subShopKdtId] : [];
      delete data.kdtId;
    }

    if (+orderType === 1) {
      // 按最近申请时间降序
      data.sortType = 0;
    } else {
      // 按临近超时时间升序
      data.refundTimeoutSortType = 1;
    }

    // 退款处理中：status = 2, 实际请求需要转化成 searchTag = 3
    if (+status === 2) {
      data.status = undefined;
      data.searchTag = 3;
    }

    if (refundDeliveryStatus >= 0) {
      data.reverseLogisticStatus = +refundDeliveryStatus;
    }

    // 待商家处理
    if (data.searchTag === 0) {
      data.toBeReceived = false;
    } else if (data.searchTag === 4) {
      // 待商家收货
      data.toBeReceived = true;
      data.searchTag = 0;
    }

    // eslint-disable-next-line no-bitwise
    startTime && (data.createTimeStart = ~~(+startTime / 1000));
    // eslint-disable-next-line no-bitwise
    endTime && (data.createTimeEnd = ~~(+endTime / 1000));

    const postData = _.pickBy(data, val => val !== undefined && !_.isNaN(val));
    const { refundOrderESDTOList, total } = await new SellerRefundService(
      ctx,
    ).queryRefundOrderFromES(postData);

    ctx.json(0, 'ok', {
      list: refundOrderESDTOList || [],
      total,
    });
  }

  async getRefundDetail(ctx) {
    const kdtId = +ctx.kdtId;
    const { orderNo } = ctx.query;
    const query = {
      kdtId,
      orderNo,
      showRefundFail: false,
    };
    const result = await new SellerRefundService(ctx).queryRefundFundAggr(query);
    ctx.json(0, 'ok', result);
  }

  async getRefundProcedure(ctx) {
    const { kdtId } = ctx;
    const { orderNo, refundNo, refundId } = ctx.query;
    const query = {
      kdtId,
      orderNo,
      refundNo,
      refundId,
    };
    const result = await new RefundFundFlowQueryService(ctx).queryRefundFund(query);
    ctx.json(0, 'ok', result);
  }

  // 同意退款
  async agreeRefunds(ctx) {
    const kdtId = +ctx.kdtId;
    const { refunds } = ctx.request.body;

    this.validator.required(refunds, '退款列表不能为空');
    this.validator.required(refunds.length > 0, '退款列表不能为空');
    const result = await new BatchRefundOperateService(ctx).batchAgree({
      kdtId,
      refundOrderInfoDTOList: refunds,
      source: this.source,
      rpBatchBizTag: 0,
      operator: {
        operatorId: this.operator.operatorId,
        role: this.operator.role,
        scOperatorStr: this.scOperatorStr,
      },
    });
    ctx.json(0, 'ok', result);
  }

  // 拒绝退款
  async refuseRefunds(ctx) {
    const kdtId = +ctx.kdtId;
    const { remark, refunds } = ctx.request.body;
    this.validator.required(remark, '拒绝理由不能为空');
    this.validator.required(refunds, '退款列表不能为空');
    this.validator.required(refunds.length > 0, '退款列表不能为空');

    const result = await new BatchRefundOperateService(ctx).batchRefundRefuse({
      kdtId,
      remark,
      refundOrderInfoDTOList: refunds,
      rpBatchBizTag: 0,
      source: this.source,
      operator: {
        operatorId: this.operator.operatorId,
        role: this.operator.role,
        scOperatorStr: this.scOperatorStr,
      },
    });

    ctx.json(0, 'ok', result);
  }

  // 同意退货退款
  async agreeGoodsReturn(ctx) {
    const kdtId = +ctx.kdtId;
    const { remark, refunds, address } = ctx.request.body;

    this.validator.required(refunds, '退款列表不能为空');
    this.validator.required(refunds.length > 0, '退款列表不能为空');
    this.validator.required(address, '退货地址不能为空');

    const result = await new BatchRefundOperateService(ctx).batchRefundGoodsReturnAgree({
      ...address,
      kdtId,
      remark,
      refundOrderInfoDTOList: refunds,
      rpBatchBizTag: 0,
      source: this.source,
      operator: {
        operatorId: this.operator.operatorId,
        role: this.operator.role,
        scOperatorStr: this.scOperatorStr,
      },
    });
    ctx.json(0, 'ok', result);
  }

  // 拒绝退货
  async refuseGoodsReturn(ctx) {
    const { remark, refunds } = ctx.request.body;
    this.validator.required(remark, '拒绝理由不能为空');
    this.validator.required(refunds, '退款列表不能为空');
    this.validator.required(refunds.length > 0, '退款列表不能为空');
    const kdtId = +ctx.kdtId;
    const result = await new BatchRefundOperateService(ctx).batchRefundGoodsRefuse({
      kdtId,
      remark,
      refundOrderInfoDTOList: refunds,
      rpBatchBizTag: 0,
      source: this.source,
      operator: {
        operatorId: this.operator.operatorId,
        role: this.operator.role,
        scOperatorStr: this.scOperatorStr,
      },
    });

    ctx.json(0, 'ok', result);
  }

  async getIsAllowBatchOperate(ctx) {
    const { refundIds, demand, status } = ctx.request.body;
    this.validator.required(demand, '退款诉求不能为空');
    this.validator.required(status, '退款状态不能为空');
    this.validator.required(refundIds, '退款列表不能为空');
    this.validator.required(refundIds.length > 0, '退款列表不能为空');

    const result = await new BatchRefundQueryService(ctx).queryIsAllowBatchOperate({
      refundIdList: refundIds,
      demand: +demand,
      status: +status,
    });
    const data = result
      .filter(item => item.isAllowOperate)
      .map(({ refundOrderDTO }) =>
        _.pick(refundOrderDTO, [
          'refundId',
          'orderNo',
          'phase',
          'refundFee',
          'demand',
          'payType',
          'version',
          'extension',
        ]),
      );
    ctx.json(0, 'ok', data);
  }

  /**
   * 批量查询是否允许退款
   */
  async queryIsAllowBatchOperate(ctx) {
    const { refundIds, demand, status } = JSON.parse(ctx.query.params);
    this.validator.required(demand, '退款诉求不能为空');
    this.validator.required(status, '退款状态不能为空');
    this.validator.required(refundIds, '退款列表不能为空');
    this.validator.required(refundIds.length > 0, '退款列表不能为空');

    const result = await new BatchRefundQueryService(ctx).queryIsAllowBatchOperate({
      refundIdList: refundIds,
      demand: +demand,
      status: +status,
    });
    const data = result
      .filter(item => item.isAllowOperate)
      .map(({ refundOrderDTO }) =>
        _.pick(refundOrderDTO, [
          'refundId',
          'orderNo',
          'phase',
          'refundFee',
          'demand',
          'payType',
          'version',
          'extension',
        ]),
      );
    ctx.json(0, 'ok', data);
  }

  async getRefundsOperateResult(ctx) {
    const { refundIds, operate } = ctx.request.body;
    this.validator.required(operate, '退款操作不能为空');
    this.validator.required(refundIds, '退款列表不能为空');
    this.validator.required(refundIds.length > 0, '退款列表不能为空');

    const result = await new BatchRefundQueryService(ctx).queryRefundOperateResult({
      refundIds,
      operate,
    });
    ctx.json(0, 'ok', result);
  }

  /**
   * 批量查询处理退款进度
   */
  async queryRefundOperateResult(ctx) {
    const { refundIds, operate } = JSON.parse(ctx.query.params);
    this.validator.required(operate, '退款操作不能为空');
    this.validator.required(refundIds, '退款列表不能为空');
    this.validator.required(refundIds.length > 0, '退款列表不能为空');

    const result = await new BatchRefundQueryService(ctx).queryRefundOperateResult({
      refundIds,
      operate,
    });
    ctx.json(0, 'ok', result);
  }

  async getRefundAddress(ctx) {
    const { kdtId } = ctx;
    const { page, pageSize } = ctx.query;
    const data = await new ShopAddressService(ctx).getShopAddressList({
      kdtId,
      addressType: 1,
      pageNum: +page || 1,
      pageSize: +pageSize || 20,
    });
    ctx.json(0, 'ok', data);
  }

  /** 获取默认退货地址 */
  async getDefaultAddress(ctx) {
    const { kdtId } = ctx;
    // 地址类型，1:退货地址，2:发票地址，4:发货地址
    const data = await new ShopAddressService(ctx).queryDefaultShopAddress(kdtId, 1);
    ctx.json(0, 'ok', data);
  }

  /** 获取国家码 */
  async getCountryCodeList(ctx) {
    const countryCodeList = await new CountryCodeListService(ctx).getCountryCodeList();
    ctx.json(0, 'ok', countryCodeList);
  }

  /** 新增默认退货地址 */
  async addShopAddress(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.getLocalSession('userInfo');

    const data = await new ShopAddressService(ctx).addShopAddress({
      ...ctx.request.body,
      kdtId,
      accountId: id,
    });
    ctx.json(0, 'ok', data);
  }

  async queryRefundAddressList(ctx) {
    const { kdtId } = ctx;
    const { page, pageSize, keyword } = ctx.query;
    const data = await new ShopAddressOuterService(ctx).queryShopAddressList({
      kdtId,
      addressTypeValues: [1],
      keyword,
      pageNum: +page || 1,
      pageSize: +pageSize || 20,
    });
    ctx.json(0, 'ok', data);
  }

  // 获取总店/网店下属所有店铺退货地址
  async queryAllRefundAddressList(ctx) {
    const { kdtId, userId: adminId } = ctx;
    const { page, pageSize, keyword, orderNo, itemId } = ctx.query;
    const param = {
      kdtId,
      adminId,
      retailSource: this.source.from,
      orderNo,
      orderItemId: itemId,
      keyword,
      pageNo: +page || 1,
      pageSize: +pageSize || 20,
    };

    const data = await new ReturnOrderService(ctx).getRefundAddressLists(param);
    ctx.json(0, 'ok', data);
  }

  //  获取订单多商品可退款余额
  async getRefundableFees(ctx) {
    const {
      kdtId,
      query: { orderNo, itemIds },
    } = ctx;
    const param = {
      orderNo,
      kdtId,
    };
    if (itemIds) {
      try {
        param.itemIds = JSON.parse(itemIds);
      } catch (e) {
        ctx.logger.warn('获取订单多商品可退款余额参数错误');
      }
    }
    const data = await new SellerRefundService(ctx).getRefundableFees(param);
    ctx.json(0, 'ok', data);
  }

  async exportRefunds(ctx) {
    const { kdtId } = ctx;
    const shopInfo = ctx.getState('shopInfo');
    const userInfo = ctx.getLocalSession('userInfo');
    const {
      orderNo,
      refundId,
      phase,
      isInvolved,
      demand,
      extra,
      status,
      startTime,
      endTime,
      state,
      goodsTitle,
      deliveryNo,
      deliveryStatus,
      order = 'desc',
      subShopKdtId,
      refundDeliveryStatus,
    } = ctx.request.body;

    const _keyword = {
      kdtId,
      orderNo,
      refundId,
      phase,
      demand,
      status,
      state,
      goodsTitle,
      deliveryNo,
      deliveryStatus,
      involvedStatus: isInvolved,
      searchTag: +extra,
      timeType: 'create_time',
    };

    const exportExtra = {};
    const isHqStore = utilsShop.checkHqStore(shopInfo);
    const isPartnerStore = utilsShop.checkPartnerStore(shopInfo);

    // 连锁总店 或 合伙人店铺时 新增headKdtId
    if (isHqStore || isPartnerStore) {
      // 合伙人搜索时新增partnerKdtId字段
      if (isPartnerStore) {
        _keyword.partnerKdtId = kdtId;
      }
      _keyword.headKdtId = shopInfo.rootKdtId;
      _keyword.kdtId = +subShopKdtId;
    }

    // 待商家处理
    if (_keyword.searchTag === 0) {
      exportExtra.toBeReceived = false;
    } else if (_keyword.searchTag === 4) {
      // 待商家收货
      exportExtra.toBeReceived = true;
      _keyword.searchTag = 0;
    }

    // eslint-disable-next-line no-bitwise
    startTime && (_keyword.createTimeStart = ~~(+startTime / 1000));
    // eslint-disable-next-line no-bitwise
    endTime && (_keyword.createTimeEnd = ~~(+endTime / 1000));
    const keyword = _.pickBy(_keyword, val => val !== undefined && !_.isNaN(val));

    if (refundDeliveryStatus >= 0) {
      keyword.reverseLogisticStatus = +refundDeliveryStatus;
    }

    const params = {
      account: userInfo.account,
      nickName: this.operator.operatorName,
      templateId: 15,
      source: 'wsc',
      bizType: 'refund',
      exportType: 'record',
      options: {
        format: 'csv',
      },
      keyword,
      order,
      extra: exportExtra,
    };

    // 零售连锁店铺导出模版改为20
    if (utilsShop.checkRetailChainStore(shopInfo)) {
      params.templateId = 20;
    }

    const data = await new RefundExportService(ctx).export(params);
    ctx.json(0, 'ok', data);
  }
}

module.exports = RefundsController;
