const OrderBaseController = require('./OrderBaseController');
const omitBy = require('lodash/omitBy');
const isEmpty = require('lodash/isEmpty');
const get = require('lodash/get');

const OrderSearchService = require('../../../services/search/OrderSearchService');
const StoreReadService = require('../../../services/multistore/StoreReadService');
const OrderProcessService = require('../../../services/order/OrderProcessService');
const ShopConfigReadService = require('../../../services/shop/ShopConfigReadService');
const mapKeysToCamelCase = require('@youzan/utils/string/mapKeysToCamelCase').default;
const OrderSourceToFrontEndService = require('../../../services/ebiz/OrderSourceToFrontEndService');
const utilsShop = require('@youzan/utils-shop');

class OrderListController extends OrderBaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '订单查询';
  }

  async eduAbilityCheck() {
    const { ctx } = this;
    const { kdtId } = ctx;
    const shopInfo = ctx.getState('shopInfo');

    // 连锁校区下设置总部的店铺信息
    if (utilsShop.checkEduBranchStore(shopInfo)) {
      await this.setHqShopInfo(ctx);
    }

    /**
     * 是否开启堂食插件
     */
    try {
      const TSKEY = 'eat_in_order_plugin_has_opened';
      const tangshiConfig = await new ShopConfigReadService(ctx).queryShopConfig(kdtId, TSKEY);
      const mealOrderManageAbility = get(tangshiConfig, 'value', false) === '1' ? true : false;
      ctx.setGlobal('mealOrderManageAbility', mealOrderManageAbility);
    } catch (e) {
      ctx.setGlobal('mealOrderManageAbility', false);
    }
  }

  /**
   * 获取风控给订单打标签的配置
   */
  async getRiskApolloConfig() {
    const namespace = 'risk-thanos.core_share';
    const tagKey = 'exception.order.tag';
    const hoverKey = 'exception.order.hover';

    try {
      const apolloClient = this.getApolloClientByAppId('risk-thanos');

      const [tagConfig, hoverConfig] = await Promise.all([
        apolloClient.getNamespaceConfig({
          namespace,
          key: tagKey,
        }),
        apolloClient.getNamespaceConfig({
          namespace,
          key: hoverKey,
        }),
      ]);

      const riskOrderConfigs = {
        tag: JSON.parse(tagConfig[tagKey]),
        hover: JSON.parse(hoverConfig[hoverKey]),
      };

      this.ctx.setGlobal('riskOrderConfigs', riskOrderConfigs);
    } catch (e) {
      //
    }
  }

  /**
   * 订单列表页
   * @param {*} ctx
   */
  async getIndexHtml(ctx) {
    await Promise.all([
      this.initStoreId(),
      this.initTeamAdmin(),
      this.initVersionStatus(),
      this.initIsShowMultiStore(),
      this.eduAbilityCheck(),
      this.getRiskApolloConfig(),
    ]);

    await ctx.render('na/order/list.html');
  }

  getKeywordParam(query) {
    const isKeyword = path => /^keyword/.test(path);
    const realKey = path => path.match(/\[([^)]*)\]/)[1];
    const keyword = {};

    for (const key in query) {
      if (isKeyword(key)) {
        keyword[realKey(key)] = query[key];
        delete query[key];
      }
    }

    if (!isEmpty(keyword)) {
      query.keyword = keyword;
    }

    return query;
  }

  // 处理订单列表页请求的参数
  getOrderListParam(query) {
    const camelQuery = omitBy(mapKeysToCamelCase(query), value => {
      return value === 'all';
    });

    if (camelQuery.p) {
      camelQuery.page = camelQuery.p;
      delete camelQuery.p;
    }

    // 处理 keyword 的问题
    const queryResult = this.getKeywordParam(camelQuery);

    return queryResult;
  }

  /**
   * 获取订单列表
   *
   * @param {*} ctx
   * @returns
   */
  async getListJson(ctx) {
    const query = ctx.getQueryData();
    const shopInfo = ctx.getState('shopInfo');
    const { kdtId } = ctx;
    const param = this.getOrderListParam(query);
    const { subShopKdtId } = param;

    const paramFinal = {
      ...param,
      kdtId,
      caller: 'PC',
    };

    // 连锁店铺传总店headKdtId
    if (utilsShop.checkWscChainStore(shopInfo)) {
      const headKdtId = get(shopInfo, 'rootKdtId');
      paramFinal.headKdtId = headKdtId;

      // 微商城连锁总店 kdtId 为查询店铺的 kdtId
      if (utilsShop.checkWscHqStore(shopInfo)) {
        paramFinal.kdtId = subShopKdtId ? +subShopKdtId : 0;
      }
    }

    delete paramFinal.subShopKdtId;
    const result = await new OrderSearchService(ctx).searchFormat(paramFinal);
    return ctx.successRes(result);
  }

  /**
   * 订单加星
   * @param {*} ctx
   */
  async star(ctx) {
    const query = ctx.getPostData();
    const { star, orderNo } = query;
    const { kdtId } = ctx;
    const userInfo = ctx.getLocalSession('userInfo');
    const operator = {
      role: 'seller',
      operatorPhone: userInfo.mobile,
      operatorId: userInfo.id,
      operatorName: userInfo.nickName,
    };
    const param = {
      kdtId,
      star,
      orderNo,
      operator,
    };
    const result = await new OrderProcessService(ctx).star(param);

    return ctx.successRes(result);
  }

  /**
   * 订单备注
   * @param {*} ctx
   */
  async remark(ctx) {
    const query = ctx.getPostData();
    const { remark, orderNo } = query;
    const { kdtId } = ctx;
    const userInfo = ctx.getLocalSession('userInfo');
    const operator = {
      role: 'seller',
      operatorPhone: userInfo.mobile,
      operatorId: userInfo.id,
      operatorName: userInfo.nickName,
    };
    const param = {
      kdtId,
      remark,
      orderNo,
      operator,
    };
    const result = await new OrderProcessService(ctx).remark(param);

    return ctx.successRes(result);
  }

  // 获取网点名称列表
  async getOfflineNameList(ctx) {
    const queryParams = ctx.getQueryData();
    const params = { ...queryParams, kdtId: ctx.kdtId };
    const result = await new StoreReadService(ctx).listNameByCondition(params);
    ctx.successRes(result);
  }

  /**
   * 获取单条订单数据
   */
  async getOrderDataJson(ctx) {
    const { query, kdtId } = ctx;
    const { orderNo, expressType, extType, type, orderId } = query;
    const result = await new OrderSearchService(ctx).searchFormatNoCache({
      kdtId: +kdtId,
      keyword: {
        orderNo,
        orderId,
      },
      expressType, // 查同城配送的信息需要带上
      extType, // 查多网点相关的信息需要带上
      type, // 后端需要根据不同的订单类型去查对应的信息
    });

    const orderData = get(result, 'list[0]', null);
    return ctx.successRes(orderData);
  }

  /**
   * 获取订单来源列表
   */
  async getOrderSourceList(ctx) {
    const shopInfo = ctx.getState('shopInfo');
    const source = utilsShop.checkEduShop(shopInfo) ? 'edu' : 'wsc';
    const orderSourceList = await new OrderSourceToFrontEndService(ctx).orderSourceToFrontEnd({
      source,
    });
    return ctx.successRes(orderSourceList);
  }
}

module.exports = OrderListController;
