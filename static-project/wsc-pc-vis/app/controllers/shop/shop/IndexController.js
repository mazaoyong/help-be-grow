/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/**
 * 有赞教育店铺创建相关, 不走shopinfo中间件
 */
const uuidv4 = require('uuid/v4');
// const URL = require('@youzan/wsc-pc-base/app/lib/URL');
const BaseController = require('../../base/BaseController');
const CategoryReadOuterService = require('../../../services/shopcenter/outer/CategoryReadOuterService');
const ShopCreateOuterService = require('../../../services/shopcenter/outer/ShopCreateOuterService');
const ShopNameCheckOuterService = require('../../../services/shopcenter/outer/ShopNameCheckOuterService');
const IronApiService = require('../../../services/api/iron/IronApiService');
const ItemQueryService = require('../../../services/mall/api/ItemQueryService');
const SmsCaptchaService = require('../../../services/uic/captcha/SmsCaptchaService');
const BehaviorCaptchaService = require('../../../services/uic/captcha/BehaviorCaptchaService');
const ShopTypeModifyOuterService = require('../../../services/shopcenter/outer/ShopTypeModifyOuterService');
const ShopTopicModifyOuterService = require('../../../services/shopcenter/outer/ShopTopicModifyOuterService');
const EduChainCreateOuterService = require('../../../services/shopcenter/outer/EduChainCreateOuterService');
const ShopQueryService = require('../../../services/owl/pc/shop/ShopQueryService.js');
const BehaviorCaptchaException = require('../../../exceptions/shop/BehaviorCaptchaExceptions');

class IndexController extends BaseController {
  init() {
    super.init();
    this.initUserInfo();
  }

  /**
   * 店铺单页html
   */
  async getIndexHtml(ctx) {
    // 连锁白名单检查
    const { mobile } = ctx.getLocalSession('userInfo');
    const whiteList = await this.callService(
      'wsc-pc-base/common.WhitelistService',
      'getWhitelist',
      'yzedu_chain_users',
    );
    // greyRelease 只支持kdtId，用whitelist模拟一个白名单；全部删除就表示放开白名单
    const allowChain = whiteList.length < 2 ? true : whiteList.includes(mobile);
    ctx.setGlobal('yzEduChainWhitelist', allowChain);

    // 设置 ABTest 数据
    // 除了QA环境，其他环境都设置ABTest
    if (this.ctx.getGlobal('nodeEnv') !== 'qa') {
      this.setABTestConfig();
    }
    await ctx.render('shop/shop_index.html');
  }

  /**
   * 查询教育店铺目录树
   */
  async getEduCategoryJson(ctx) {
    const res = await new CategoryReadOuterService(ctx).queryWscEduCategoryTree();
    return ctx.json(0, 'ok', res);
  }

  /**
   * 微商城教育版店铺名称校验
   */
  async getCheckShopNameJson(ctx) {
    const { id: accountId } = ctx.getLocalSession('userInfo');
    const { kdtId } = ctx;
    const { shopName, isSingle } = ctx.query || {};
    const isCreateSingleShop = isSingle === 'true';

    const res = await new ShopNameCheckOuterService(ctx).checkChainShopName({
      kdtId,
      shopName,
      accountId,
      isCreateSingleShop,
    });
    return ctx.json(0, 'ok', res);
  }

  /**
   * 创建新店铺
   */
  async postCreateEduShopJson(ctx) {
    const { id: operatorId } = ctx.getLocalSession('userInfo');
    const { shopName, address, businessId } = ctx.request.body || {};
    const reqData = {
      appName: 'wsc-pc-vis',
      address,
      businessId,
      entryAppName: 'wsc-pc-vis',
      ipAddress: ctx.firstXff || ctx.ip,
      operatorType: 1, // EDUTODO
      operatorId,
      requestId: uuidv4(),
      shopName,
    };
    const newKdtId = await new ShopCreateOuterService(ctx).createWscEduShop(reqData);
    // 指定微页面模板: 27-知识付费
    const res = await new IronApiService(ctx).chooseSolutionByCategoryId(newKdtId, {
      categoryId: 27,
      isCreateGoods: 'false',
    });
    return ctx.json(0, 'ok', {
      kdtId: newKdtId,
      res,
    });
  }

  /**
   * 有赞教育商业化白名单控制
   */
  async getEduShopCreateInfoJson(ctx) {
    const { mobile } = ctx.getLocalSession('userInfo');
    const whiteList = await this.callService(
      'wsc-pc-base/common.WhitelistService',
      'getWhitelist',
      'yzedu_grey_users',
    );
    // greyRelease 只支持kdtId，用whitelist模拟一个白名单；全部删除就表示放开白名单
    const eduBetaStatus = whiteList.length < 2 ? true : whiteList.includes(mobile);
    return ctx.json(0, 'ok', {
      eduBetaStatus,
    });
  }

  /**
   * 查询店铺内是否有在售实物商品
   */
  async getOnSellGoodsJson(ctx) {
    // 无登录店铺态，url传参
    const { kdtId } = ctx.query || {};
    const res = await new ItemQueryService(ctx).listItemsPaged({
      kdtId,
      showSoldOut: 0,
      itemTypes: [0],
      itemTypesNotExclude: [10],
    });
    let hasPhysicalGoods = true;
    if (res.items && res.items.length === 0) hasPhysicalGoods = false;
    return ctx.json(0, 'ok', {
      hasPhysicalGoods,
    });
  }

  /**
   * 查询可以升级的店铺列表（身份是高级管理员的店铺）
   */
  async queryModifiableShopsJson(ctx) {
    const { id: accountId } = ctx.getLocalSession('userInfo');
    const { pageSize = 6, pageNum = 1 } = ctx.query || {};
    const res = await new ShopTypeModifyOuterService(ctx).queryModifiableShops({
      accountId,
      pageSize,
      pageNum,
      shopTypes: [0], // 仅传入微商城type
      shopTopics: [0], // 排除教育类型
      shopRoles: [0], // 排除连锁相关店铺
    });
    return ctx.json(0, 'ok', res);
  }

  /**
   * 店铺升级
   */
  async upgradeToEduShopJson(ctx) {
    const { captcha, kdtId, business, mobile } = ctx.request.body || {};
    let captchaRes = {}; let shopRes = false;
    // 1 校验验证码
    captchaRes = await new SmsCaptchaService(ctx).validSmsCaptcha({
      biz: 'wsc_up_to_edu',
      mobile: mobile,
      smsCaptcha: captcha,
    });
    if (captchaRes.success) {
      // 2 business 传给店铺暂存
      shopRes = await new ShopTopicModifyOuterService(ctx).saveWsc2EduTmpBusinessId(
        kdtId,
        business,
      );
    }
    return ctx.json(0, 'ok', { captchaRes, shopRes });
  }

  /**
   * 店铺升级获取验证码，此处没有shop状态，中间件对此路径排除掉了，
   * 所以先写在这儿，其他地方用到验证码发送考虑抽到公用位置
   */
  async sendSmsCaptchaJson(ctx) {
    const { mobile } = ctx.query || {};
    // 1 校验验证码
    const captchaRes = await new SmsCaptchaService(ctx).sendSmsCaptcha({
      biz: 'wsc_up_to_edu',
      mobile: mobile,
    });
    return ctx.json(0, 'ok', captchaRes);
  }

  /**
   * 店铺升级获取验证码，此接口加入行为组件校验，防止短信轰炸
   */
  async sendBehaviorCaptchaJson(ctx) {
    const { mobile, ticket } = ctx.getQueryParse() || {};
    this.validator.required(ticket, '参数错误，token不能为空');
    this.validator.required(mobile, '参数错误，手机数据不能为空');

    const result = await new BehaviorCaptchaService(ctx).secondCheckBehaviorToken({
      token: ticket
    });
    // 1 校验验证码
    if (result) {
      const captchaRes = await new SmsCaptchaService(ctx).sendSmsCaptcha({
        biz: 'wsc_up_to_edu',
        mobile: mobile,
      });
      return ctx.json(0, 'ok', captchaRes);
    } else {
      return ctx.json(BehaviorCaptchaException.code, BehaviorCaptchaException.message);
    }
  }

  /**
   * 创建教育总部
   */
  async createEduHQ(ctx) {
    const { id: operatorId } = ctx.getLocalSession('userInfo');
    const { shopName, address, businessId } = ctx.request.body || {};
    const reqData = {
      appName: 'wsc-pc-vis',
      address,
      businessId,
      entryAppName: 'wsc-pc-vis',
      fromTerminal: 0,
      ipAddress: ctx.firstXff || ctx.ip,
      operatorType: 1, // EDUTODO
      operatorId,
      requestId: uuidv4(),
      shopName,
    };
    const newKdtId = await new EduChainCreateOuterService(ctx).createEduHQ(reqData);
    // 指定微页面模板: 27-知识付费
    const res = await new IronApiService(ctx).chooseSolutionByCategoryId(newKdtId, {
      categoryId: 27,
      isCreateGoods: 'false',
    });
    return ctx.json(0, 'ok', {
      kdtId: newKdtId,
      res,
    });
  }

  /**
    *  * 获取分校区（分店）列表
   */
  async findPageAllCampus(ctx) {
    const { kdtId } = ctx;
    const { shopCampusQuery } = ctx.getQueryParse() || {};
    shopCampusQuery['hqKdtId'] = kdtId;
    const resp = await new ShopQueryService(ctx).findPageAllCampus(shopCampusQuery);
    return ctx.json(0, 'ok', resp);
  }

  // 设置 ABTest apollo 数据
  setABTestConfig() {
    const { ctx } = this;
    const config = ctx.ABTestClient.getConfig();

    ctx.setGlobal('abTestConfig', config);
  }
}

module.exports = IndexController;
