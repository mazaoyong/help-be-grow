/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/**
 * 有赞教育校区管理相关接口
 */
const uuidv4 = require('uuid/v4');
const assign = require('lodash/assign');
const get = require('lodash/get');
const omit = require('lodash/omit');
const BaseController = require('../../base/BaseController');
const EduChainCreateOuterService = require('../../../services/shopcenter/outer/EduChainCreateOuterService');
// const EduChainWriteOuterService = require('../../../services/shopcenter/outer/EduChainWriteOuterService');
const EduChainReadService = require('../../../services/shopcenter/shopfront/EduChainReadService');
const ShopChainSearchService = require('../../../services/shopcenter/shopfront/ShopChainSearchService');
const ShopChainActivateService = require('../../../services/shopcenter/shopfront/ShopChainActivateService');
const ShopConfigService = require('../../../services/shopcenter/chain/ShopConfigService.js');
const ChainShopConfigService = require('../../../services/api/owl/pc/ChainShopConfigFacade');

class ChainController extends BaseController {
  init() {
    super.init();
    this.initUserInfo();
  }

  async createSubShop(ctx) {
    const { values } = ctx.request.body;
    const reqData = Object.assign(JSON.parse(values), this.getBaseParams(ctx));
    const status = get(reqData, 'funcConfigs.subshop_stock_independent', '0');
    reqData.funcConfigs = omit(reqData.funcConfigs, 'subshop_stock_independent');
    const res = await new EduChainCreateOuterService(ctx).createSubShop(reqData);
    // 保存自定义库存开关的状态（走商品业务线）
    const operatorParams = this.getOperatorParams(ctx);
    const stockParams = assign({}, operatorParams, {
      subKdtId: res,
      hqKdtId: ctx.kdtId,
      stockModel: status,
    });
    await new ShopConfigService(ctx).saveStockConfig(stockParams);
    ctx.json(0, 'ok', res);
  }

  // 获取通用的操作参数
  getOperatorParams(ctx) {
    const { kdtId, firstXff } = ctx;
    const { id: userId, nickName } = ctx.getLocalSession('userInfo');

    return {
      fromApp: 'wsc-pc-vis',
      kdtId,
      operator: {
        nickName,
        userId,
        clientIp: firstXff,
        source: 'wsc-pc-vis',
      },
    };
  }

  async updateSubShop(ctx) {
    const { values, id: kdtId } = ctx.request.body;
    const reqData = Object.assign(JSON.parse(values), this.getBaseParams(ctx), { kdtId });
    const status = get(reqData, 'funcConfigs.subshop_stock_independent', '0');
    reqData.funcConfigs = omit(reqData.funcConfigs, 'subshop_stock_independent');
    const result = await new ChainShopConfigService(ctx).updateSubShop(reqData);
    // 保存自定义库存开关的状态（走商品业务线）
    const operatorParams = this.getOperatorParams(ctx);
    const stockParams = assign({}, operatorParams, {
      subKdtId: kdtId,
      hqKdtId: ctx.kdtId,
      stockModel: status,
    });

    await new ShopConfigService(ctx).saveStockConfig(stockParams);
    ctx.json(0, 'ok', result);
  }

  async querySubShop(ctx) {
    const { id } = ctx.request.query;
    const res = await new ChainShopConfigService(ctx).querySubShop(ctx.kdtId, id);
    ctx.json(0, 'ok', res);
  }

  async searchDescendentShop(ctx) {
    const { kdtId } = ctx;
    const { id: adminId } = ctx.getLocalSession('userInfo');
    const {
      p = 1,
      pageSize = 10,
      shopName = null,
      managerKeyword = null,
      shopStatus,
      joinType,
      isRealTimeMode,
    } = ctx.request.query;

    const params = {
      adminId,
      hqKdtId: kdtId,
      managerKeyword,
      pageSize: +pageSize,
      pageNum: +p,
      shopName,
    };

    if (joinType > 0) {
      params.joinTypes = [+joinType];
    }
    if (shopStatus && +shopStatus !== -1) {
      params.shopLifecycleStatuses = [shopStatus];
    }
    params.realTimeMode = +isRealTimeMode === 1;

    const res = await new ShopChainSearchService(ctx).searchDescendentShop(params);

    ctx.json(0, 'ok', res);
  }

  async querySubShopCreateCheckInfo(ctx) {
    const { kdtId: hqKdtId } = ctx;
    const res = await new EduChainReadService(ctx).querySubShopCreateCheckInfo(hqKdtId);
    return ctx.json(0, 'ok', res);
  }

  async activateAppInSubShop(ctx) {
    const { kdtId: hqKdtId } = ctx;
    const { id } = ctx.request.body;
    const res = await new ShopChainActivateService(ctx).activateAppInSubShop({
      hqKdtId,
      appId: 44291,
      subShopKdtId: id,
    });
    return ctx.json(0, 'ok', res);
  }

  getBaseParams(ctx) {
    const { kdtId, firstXff } = ctx;
    const { id: userId } = ctx.getLocalSession('userInfo');

    return {
      appName: 'wsc-pc-vis',
      entryAppName: 'wsc-pc-vis',
      fromTerminal: 0,
      hqKdtId: kdtId || '',
      ipAddress: firstXff || ctx.ip,
      operatorType: 1,
      operatorId: userId,
      requestId: uuidv4(),
    };
  }
}

module.exports = ChainController;
