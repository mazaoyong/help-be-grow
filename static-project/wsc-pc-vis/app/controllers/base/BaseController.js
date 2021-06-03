const { PCBaseController } = require('@youzan/wsc-pc-base');
const MarketRemoteService = require('../../services/yop/MarketRemoteService');
const MpAccountService = require('../../services/channels/MpAccountService');
const WeappAccountService = require('../../services/channels/WeappAccountService');
const CreditPolicyReadService = require('../../services/srcm/credit/policy/CreditPolicyReadService');
const ProdReadService = require('../../services/shopcenter/shopprod/ProdReadService');
const MpVersionService = require('../../services/channels/MpVersionService');
const ShopChainConfigFacade = require('../../services/owl/pc/shop/ChainShopConfigService');

const { get } = require('lodash');

const pctAppId = 6852; // 知识付费订购 id
const HQStoreRoleType = 1;
const BranchStoreRoleType = 2;

/**
 * Project Base Controller
 */
class BaseController extends PCBaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.initVersionStatus(this.ctx);
    }
  }

  /**
   * 返回操作人信息
   *
   * @readonly
   * @memberof BaseInfoController
   * @return {role, operatorPhone, operatorId, operatorName}
   */
  get operator() {
    const { ctx } = this;
    const userInfo = ctx.getLocalSession('userInfo') || {};
    const operator = {
      role: 'seller',
      operatorPhone: userInfo.mobile,
      operatorId: userInfo.id,
      operatorName: userInfo.nickName,
    };
    return operator;
  }

  /**
   * 返回用户的ip信息
   *
   * @readonly
   * @memberof BaseInfoController
   * @return {clientIp, from}
   */
  get source() {
    const { ctx } = this;
    const source = {
      clientIp: ctx.firstXff,
      from: 'wsc-pc-vis',
    };

    return source;
  }

  /**
   * 返回格式化后的操作人信息
   *
   * @readonly
   * @memberof BaseController
   */
  get formatOperator() {
    const { operatorName, operatorId, operatorPhone } = this.operator;
    const { clientIp, from } = this.source;

    return {
      clientIp,
      nickName: operatorName,
      source: from,
      userId: operatorId,
      mobile: operatorPhone,
    };
  }

  /**
   * 统一设置页面的环境变量
   *
   * @param {Object} ctx
   * @memberof PctBaseController
   */
  async initVisPage(ctx) {
    await Promise.all([
      this.initWeappStatus(ctx),
      this.initMpAccount(ctx),
      this.initPctStatus(ctx),
      this.initWeappVersion(ctx),
      this.initLifecycle(ctx),
      this.setChainShopSettings(ctx),
    ]);
  }

  /** 获取连锁店铺的配置 */
  async setChainShopSettings() {
    const { kdtId: branchStoreKdtId } = this.ctx;
    try {
      const shopInfo = this.ctx.getState('shopInfo');
      const shopMetaInfo = this.ctx.getState('shopMetaInfo');
      const shopRole = shopInfo.shopRole || 0; // 获取店铺角色信息，如果没有就设置为单店
      if ([HQStoreRoleType, BranchStoreRoleType].includes(shopRole)) {
        const hqStoreKdtId = shopMetaInfo.parentKdtId || shopMetaInfo.rootKdtId;
        const res = await new ShopChainConfigFacade(this.ctx).querySubShop(
          hqStoreKdtId,
          branchStoreKdtId,
        );
        this.ctx.setGlobal('chainShopSettings', get(res, 'funcConfigs'));
      }
    } catch (err) {
      console.error('[获取连锁店铺能力出错]');
      console.error(err);
    }
  }

  /**
   * 初始化 global 上的 lifecycle，用来判断店铺生命周期
   *
   * @param {*} ctx
   */
  async initLifecycle(ctx) {
    const kdtId = ctx.kdtId;
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );
    ctx.setGlobal('lifecycle', lifecycle || {}); // 店铺生命周期
  }

  /**
   * 初始化 global 上的 weappStatus，用来判断小程序订购状态
   *
   * @memberof PctBaseController
   */
  async initWeappStatus(ctx) {
    const kdtId = ctx.kdtId;
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    const weappStatus = await new MarketRemoteService(ctx).getWeAppStatus(rootKdtId || kdtId);
    ctx.setGlobal('weappStatus', weappStatus || {}); // 小程序订购状态
  }

  /**
   * 初始化 global 上的 versionStatus，用来判断教育店铺版本
   *
   * @memberof PctBaseController
   */
  async initVersionStatus(ctx) {
    const kdtId = ctx.kdtId;
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    try {
      const result = await new ProdReadService(ctx).queryShopProdVersions(rootKdtId || kdtId);
      if (Array.isArray(result) && result.length) {
        const versionStatus = result.filter(item => item.lifecycleStatus !== 'prepare').sort((pre, next) => parseInt(next.beginTime) - parseInt(pre.beginTime));
        ctx.setGlobal('versionStatus', versionStatus[0] || {}); // 教育店铺版本
        ctx.setState('versionStatus', versionStatus[0] || {});
      }
    } catch (e) {
      console.error('get versionstatus error: ', e);
      ctx.setGlobal('versionStatus', {});
      ctx.setState('versionStatus', {});
    }
  }

  /**
   * 初始化 global 上的 weappStatus，用来判断小程序版本
   *
   * @param {*} ctx
   */
  async initWeappVersion(ctx) {
    const kdtId = ctx.kdtId;
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    const weappVersion = await new WeappAccountService(ctx).getWeappCodeLcByKdtId(rootKdtId || kdtId);
    const weappAccount = await new WeappAccountService(ctx).getWeappAccountByKdtId(rootKdtId || kdtId);
    ctx.setGlobal('weappVersion', weappVersion || {}); // 小程序版本
    ctx.setGlobal('weappAccount', weappAccount || {}); // 小程序账户
  }

  /**
   * 初始化 global 上的 mpAccount，获取微信公众号详情
   *
   * @memberof PctBaseController
   */
  async initMpAccount(ctx) {
    const kdtId = ctx.kdtId;
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    const mpAccount = await new MpAccountService(ctx).getMpAccount(rootKdtId || kdtId);
    ctx.setGlobal('mpAccount', mpAccount || {}); // 小程序订购状态
  }

  /**
   * 初始化 global 中百度小程序信息
   * @param {*} ctx
   */

  async initBdappInfo(ctx) {
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    const getMpVersionDto = {
      businessType: 1,
      accountType: 6,
      kdtId: rootKdtId || ctx.kdtId,
    };

    const bdappVersion = await new MpVersionService(ctx).getMpVersion(getMpVersionDto);
    bdappVersion && ctx.setGlobal('bdapp', bdappVersion || {});
  }

  /**
   * 初始化 global 上的 pctStatus，获取知识付费应用订购状态
   *
   * @memberof PctBaseController
   */
  async initPctStatus(ctx) {
    const kdtId = ctx.kdtId;
    const pctStatus = await new MarketRemoteService(ctx).findApplicationStatus(kdtId, pctAppId);
    pctStatus.appId = pctAppId;
    ctx.setGlobal('pctStatus', pctStatus || {}); // 小程序订购状态
  }

  /**
   * 判断是否在白名单内
   * key需要在白名单配置页面提前配置好，参考：https://doc.qima-inc.com/pages/viewpage.action?pageId=58919043
   *
   * @param {*} ctx
   * @param {*} key
   */
  async checkInWhiteList(ctx, key) {
    const kdtId = ctx.kdtId;
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    return this.callService(
      'wsc-pc-base/common.GrayReleaseService',
      'isInGrayReleaseByKdtId',
      key,
      rootKdtId || kdtId
    ).catch(() => false);
  }

  /**
   * 批量设置白名单
   *
   * @param {Object} ctx
   * @param {Object[]} lists - 白名单列表
   * @param {string} lists[].key - 白名单的 key
   * @param {string} lists[].name - _global.white 里面的 key
   * @memberof PctBaseController
   */
  async setWhiteList(ctx, lists) {
    const kdtId = ctx.kdtId;
    const whiteList = {};

    await Promise.all(
      lists.map(({ key, name }) => {
        return this.callService(
          'wsc-pc-base/common.GrayReleaseService',
          'isInGrayReleaseByKdtId',
          key,
          kdtId,
        )
          .then(res => {
            whiteList[name] = res;
          })
          .catch(() => {
            whiteList[name] = false;
          });
      }),
    );

    ctx.setGlobal('white', whiteList);
  }

  /**
   * 设置自定义积分名称
   *
   * @memberof PctBaseController
   */
  async setPointsName() {
    const ctx = this.ctx;
    const dto = {
      creditDefinitionId: 0,
      kdtId: ctx.kdtId || 0,
    };

    const list = await new CreditPolicyReadService(ctx).getName(dto);
    this.ctx.setGlobal('pointsName', list.name || '积分');
  }
}

module.exports = BaseController;
