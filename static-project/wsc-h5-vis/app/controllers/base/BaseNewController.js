const { H5BaseController } = require('@youzan/iron-base');
const { enterShopForH5 } = require('@youzan/plugin-h5-enter-shop');
const { get } = require('lodash');
const args = require('zan-utils/url/args');
const _ = require('lodash');
const { checkChainStore } = require('@youzan/utils-shop');
const { injectShopRest } = require('@youzan/h5-cpns-injector-plugin/sync-inject');
const CreditPolicyReadService = require('../../services/scrm/credit/policy/CreditPolicyReadService');
const ChainProductRelationFacadeService = require('../../services/owl/client/chain/chainproduct/ChainProductRelationFacade');
const SalesmanService = require('../../services/owl/ump/salesman/SalesmanService');
const MpVersionService = require('../../services/channels/MpVersionService');
const PointsReadService = require('../../services/scrm/credit/points/PointsReadService');
const ProdReadService = require('../../services/api/shopcenter/shopprod/ProdReadService');

class BaseNewController extends H5BaseController {
  async init() {
    await super.init();
    // 全局设置一下kdtid
    this.ctx.kdtId = this.ctx.kdtId;

    // 只有页面请求才需要初始化的数据
    if (!this.ctx.acceptJSON) {
      this.checkVipDomain();
      try {
        await Promise.all([
          this.setShopMetaInfo(), // 设置店铺元信息
          this.getMpData(),
          this.initPlatform(), // 平台信息 _global.platformInfo
          this.initShopTypeAndLifeCycle(),
          this.initVersionStatus(),
          this.getMpVersion(),
          this.setShopConfigs(),
          this.initFooter(),
        ]);
      } catch (error) {
        this.ctx.visLogger.warn('[init] error', error);
      }

      this.initKdtId();
      this.initGlobalUrl();
      this.setOldPlatform();
      this.setWeappInfo();
      this.setGuangInfo();
      this.setVisBuyer();
      this.setGuang(); // 判断是否是爱逛
      this.loggerUainfo();
      this.setRunModeState(); // 统一设置 node 运行时
      this.setEbizWhiteList();
      this.setAudioPlaybgWhiteList();
      this.setPointsName();
    }
  }

  get buyer() {
    return this.ctx.visBuyer;
  }

  /**
   * 往天网发 ua 设备信息
   */
  loggerUainfo() {
    const ctx = this.ctx;
    const { mobileSystem, platform, platformVersion } = ctx;
    const ua = ctx.headers['user-agent'];

    this.ctx.visLogger.info(
      `[UA c 端设备信息] [mobileSystem: ${mobileSystem}] - [platform: ${platform}] - [platformVersion: ${platformVersion}] - [ua: ${ua}]`,
      '',
      {
        mobileSystem,
        platform,
        platformVersion,
        ua,
      },
    );
  }

  /**
   * global 设置 kdt_id
   */
  initKdtId() {
    const kdtId = this.ctx.kdtId;
    this.ctx.setGlobal('kdt_id', kdtId);
    this.ctx.setState('kdt_id', kdtId);
  }

  /**
   * 注入店铺休息提示
   *
   * 页面：
   * 1. 详情页：如果店铺正在休息，直接通过设置 design.bottom 为空数组，隐藏底部动作栏
   * 2. 下单页：通过在页面代码中判断 _global.isShopRest 是否为 true，来决定是否隐藏底部动作栏
   */
  async injectShopRest() {
    const { ctx } = this;
    try {
      await injectShopRest(ctx, 'shopRestHtml');
      ctx.setGlobal('isShopRest', !!ctx.getState('shopRestHtml'));
    } catch (err) {
      ctx.visLogger.error('[injectShopRest] inject failed', err, {});
    }
  }

  /**
   * 获取底部版权公众号信息
   */
  async getMpData() {
    await Promise.all([
      this.initMpData(), // 底部版权信息
      this.initMpAccount(), // 底部版权信息
    ]);

    const shopData = this.ctx.getState('mpData');

    const safeShopData = _.omit(shopData, ['contactCountryCode', 'contactMobile', 'contactName', 'contactQQ']);
    this.ctx.setState('mpData', safeShopData);
    this.ctx.setGlobal('mp_data', safeShopData, true);
  }

  /**
   * 设置老业务需要的平台信息 global 字段
   */
  setOldPlatform() {
    const ctx = this.ctx;
    const platformInfo = ctx.getState('platformInfo') || {};

    const { is_mobile: isMobile, platform_version: platformVersion, mobile_system: mobileSystem } = platformInfo;

    this.ctx.setGlobal('platform', ctx.platform);

    this.ctx.setGlobal('mobile_system', mobileSystem);
    this.ctx.setGlobal('is_mobile', isMobile);
    this.ctx.setGlobal('platform_version', platformVersion);
  }

  setGuang() {
    this.ctx.setGlobal('isGuang', this.ctx.isGuang);
  }

  setAppOpenId(appId, openId) {
    if (appId && openId) {
      const { ctx } = this;
      const businessDomain = () => {
        return /youzan\.com/.test(ctx.hostname) ? 'youzan.com' : ctx.hostname;
      };
      const setCookie = (key, value) => {
        const setcookieOptions = {
          domain: businessDomain(),
          maxAge: 365 * 24 * 3600 * 1000,
          signed: false,
          httpOnly: false,
        };
        ctx.setCookie(key, value, setcookieOptions);
      };

      setCookie('appId', appId);
      setCookie('openId', openId);
    }
  }

  // 初始化weapp信息
  setWeappInfo() {
    const ctx = this.ctx;
    const { url } = ctx;
    const appId = args.get('appId', url);
    const openId = args.get('openId', url);
    this.setAppOpenId(appId, openId);
  }

  // 初始化爱逛信息
  setGuangInfo() {
    const ctx = this.ctx;
    const { url } = ctx;
    let guang = args.get('guang', url);
    let appId;
    if (guang) {
      try {
        guang = decodeURIComponent(guang);
        const extInfo = JSON.parse(guang);
        appId = extInfo.appId;
      } catch (err) {}
    }
    const openId = args.get('openId', url);
    this.setAppOpenId(appId, openId);
  }

  /**
   * 初始化 店铺声明周期
   */
  async initShopTypeAndLifeCycle() {
    const ctx = this.ctx;
    const shopResult = await new ProdReadService(ctx).queryShopProd(ctx.kdtId);
    if (shopResult) {
      ctx.setEnv('lifecycleStatus', shopResult.lifecycleStatus);
    }
  }

  /**
   * 设置 visBuyer 字段
   */
  setVisBuyer() {
    const buyer = this.buyer;
    const sessionId = this.ctx.sessionId;
    this.ctx.setGlobal(
      'visBuyer',
      Object.assign({}, buyer, {
        nobody: sessionId,
      }),
    );
  }

  /**
   * 设置主题色
   */
  async setGlobalTheme() {
    await this.initGlobalTheme();
    const globalTheme = this.ctx.getState('globalTheme');
    this.ctx.setGlobal('globalTheme', globalTheme);
  }

  async getPointsName() {
    const ctx = this.ctx;
    const dto = {
      creditDefinitionId: 0,
      kdtId: ctx.kdtId || 0,
    };
    let name = '积分';
    try {
      const list = await new CreditPolicyReadService(ctx).getName(dto);
      name = list.name;
      return name;
    } catch (error) {
      return name;
    }
  }

  /**
   * 设置自定义积分名称
   */
  async setPointsName() {
    this.ctx.setGlobal('visPointsName', await this.getPointsName());
  }

  /**
   * 初始化url
   */
  initGlobalUrl() {
    const ctx = this.ctx;
    ctx.setGlobal('wap_url', ctx.getGlobal('url'));
  }

  /**
   * 店铺配置文档 https://doc.qima-inc.com/pages/viewpage.action?pageId=58919041
   * 设置购物门槛
   */
  async setShopConfigs() {
    const ctx = this.ctx;
    try {
      const data = await ctx.getShopConfigs([
        'no_fans_buy',
        'weixin_pay',
        'weixin_no',
        'weixin_subscribe',
        'weixin_server',
        'only_fans_buy_channel',
      ]);
      if (data) {
        ctx.setGlobal('shopConfigs', data);
      }
    } catch (err) {
      ctx.setGlobal('shopConfigs', {});
      ctx.visLogger.warn('获取店铺配置错误', err);
    }
  }

  /**
   * 初始化 global 上的 versionStatus，用来判断教育店铺版本
   */
  async initVersionStatus() {
    const { ctx } = this;
    const kdtId = ctx.kdtId;
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    try {
      const result = await new ProdReadService(ctx).queryShopProdVersions(rootKdtId || kdtId);
      if (Array.isArray(result) && result.length) {
        const versionStatus = result
          .filter((item) => item.lifecycleStatus !== 'prepare')
          .sort((pre, next) => parseInt(next.beginTime) - parseInt(pre.beginTime));
        ctx.setGlobal('versionStatus', versionStatus[0] || {}); // 教育店铺版本
      }
    } catch (e) {
      ctx.setGlobal('versionStatus', {});
    }
  }

  /**
   * 设置店铺元信息
   */
  async setShopMetaInfo() {
    const { kdtId } = this.ctx;

    let shopMetaInfo = {};
    try {
      shopMetaInfo = await this.callService('iron-base/shop.ShopMetaReadService', 'getShopMetaInfo', kdtId);
    } catch (err) {
      this.ctx.visLogger.warn('获取店铺元信息错误', err);
    }

    this.ctx.setGlobal('shopMetaInfo', shopMetaInfo);
  }

  // 以下可选服务

  /**
   * ACL
   */
  async baseAcl(aclConf) {
    const ctx = this.ctx;
    if (ctx.isWeapp) {
      return;
    }
    const queryStr = Object.assign(
      {
        scenes: 'paidcontent',
      },
      aclConf,
    );
    const aclResult = await this.acl(queryStr);

    ctx.setGlobal('acl_scenes_auth_result', aclResult && aclResult.aclScenesAuthResult);
    this.setVisBuyer();

    ctx.visLogger.info('[baseAcl]', '', { result: aclResult });

    ctx.localLog(
      'log',
      ctx.prettyjson({
        user: ctx.logUserStr,
        name: 'baseAcl',
        args: queryStr,
        res: aclResult,
      }),
    );

    return aclResult;
  }

  /**
   * 不展示底部版权区域
   */
  hideFooter() {
    this.ctx.setState('footerHtml', false);
  }

  /**
   * 打点
   *
   * @param {string} logType
   * @param {*} logId
   */
  setSpm(logType, logId) {
    this.ctx.setGlobal('spm', {
      logType,
      logId,
    });
  }

  /**
   * global 设置运行环境
   */
  setRunModeState() {
    // node 环境
    let runMode = '';
    if (process.env.NODE_ENV === 'pre') {
      runMode = 'pre';
    } else if (process.env.NODE_ENV === 'prod') {
      runMode = 'online';
    } else {
      runMode = 'qatest';
    }
    this.ctx.setGlobal('runMode', runMode);
  }

  async initFooter() {
    const ctx = this.ctx;
    await this.initBaseFooter();
    const footerHtml = ctx.getState('footerHtml') || '';
    ctx.setState('footerHtml', footerHtml.replace(/\/\/img\.yzcdn\.cn/, '//img01.yzcdn.cn'));
  }

  /**
   * 同步获取 shop footer（默认情况下页面通过接口异步获取）
   */
  async getFooterJson() {
    const kdtId = this.ctx.kdtId;
    const offlineId = this.ctx.offlineId;
    this.validator.required(kdtId, '参数 kdt_id 不能为空');
    const result = await this.callService('shop.ShopFooterService', 'getFooterInfo', kdtId, offlineId);

    this.ctx.setGlobal('footer_config', result);
  }

  /**
   * 连锁-根据校区（或总店）alias拿校区alias
   */

  async getChainCampusTargetAlias(query) {
    let targetAlias = '';
    if (query.sourceProductAlias) {
      try {
        const result = await new ChainProductRelationFacadeService(this.ctx).getCampusProductByCampus(query);

        if (result && result.campusProductAlias) {
          targetAlias = result.campusProductAlias;
        }
      } catch (error) {}
    }
    if (!targetAlias) {
      this.ctx.visLogger.info(
        `教育连锁商品详情获取失败：sourceKdtId:${query.sourceKdtId}, sourceProductAlias:${query.sourceProductAlias}, targetKdtId:${query.targetKdtId}`,
      );
    }
    return targetAlias;
  }

  /**
   * 连锁-自动进店逻辑
   */

  async getAutoEnterCampusInfo() {
    const ctx = this.ctx;
    const isChainStore = checkChainStore(ctx.getState('shopMetaInfo'));
    let subKdtId;
    if (isChainStore) {
      // subKdtId = await this.autoEnterChainSubShopPage();
      subKdtId = ((await enterShopForH5(ctx)) || {}).routeKdtId;
    }
    return subKdtId;
  }

  /**
   * 连锁-营销活动自动进店逻辑
   * Copy from wsc-h5-ump
   */

  async autoEnterUmpCampusInfo(umpType, umpAlias) {
    // 在小程序中webview不要走h5的进店
    if (this.ctx.isWeapp) {
      return;
    }
    const isChainStore = checkChainStore(this.ctx.getState('shopMetaInfo'));
    if (!isChainStore) {
      return;
    }
    // const subKdtId = await this.autoEnterChainSubShopPage({ umpType, umpAlias });
    const subKdtId = ((await enterShopForH5(this.ctx, { extraParams: { umpType, umpAlias } })) || {}).routeKdtId;
    let currentUrl = this.ctx.url;

    if (subKdtId) {
      const { kdtId } = this.ctx.query;

      if (kdtId) {
        currentUrl = args.remove(currentUrl, 'kdtId');
        currentUrl = args.add(currentUrl, {
          kdtId: subKdtId,
        });
      } else {
        currentUrl = args.remove(currentUrl, 'kdt_id');
        currentUrl = args.add(currentUrl, {
          kdt_id: subKdtId, // eslint-disable-line
        });
      }
      this.ctx.redirect(currentUrl);
    }
  }

  // 绑定分销员客户关系
  async bindCustomerRelationJson(sls, subKdtId) {
    const ctx = this.ctx;
    try {
      // 有时sls会拿到一个数组
      const sellerFrom = Array.isArray(sls) ? sls[0] : sls;
      const query = {
        sellerFrom,
        kdtId: subKdtId || ctx.kdtId,
        bindSourceType: 2,
        buyerId: ctx.buyerId,
        fansId: ctx.visBuyer.fansId,
        fansType: ctx.visBuyer.fansType,
      };
      await new SalesmanService(ctx).bindCustomerRelation(query);
    } catch (error) {
      ctx.visLogger.warn('[绑定客户关系失败]', error);
    }
  }

  // 获取分销员信息
  async getShareIcon(ctx, alias) {
    const kdtId = ctx.kdtId;
    let salesmanInfo = {};
    try {
      salesmanInfo = await new SalesmanService(ctx).getShareIcon({
        kdtId,
        buyerId: ctx.buyerId,
        type: 'paidcontent',
        alias,
      });
    } catch (error) {
      ctx.visLogger.warn('[获取分销员信息]', error);
    }
    ctx.setGlobal('salesmanInfo', salesmanInfo);
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
    const userInfo = ctx.getLocalSession('user') || {};
    const operator = {
      role: 'buyer',
      operatorPhone: userInfo.mobile,
      operatorId: userInfo.user_id,
      operatorName: userInfo.nickname,
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
      from: 'wsc-h5-vis',
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

  // webview跳小程序原生且原生代码有改动必须根据版本号判断
  async getMpVersion() {
    const ctx = this.ctx;

    if (!ctx.isWeapp) {
      ctx.setGlobal('weappVersion', '');
      return;
    }

    const kdtId = ctx.kdtId;
    let res = null;
    try {
      res = await new MpVersionService(ctx).getMpVersion({
        kdtId,
        accountType: 2,
        businessType: 1,
      });
    } catch (error) {
      ctx.visLogger.warn('[获取小程序版本信息]', error);
    }
    res && ctx.setGlobal('weappVersion', res.releaseVersion);
  }

  async getUserPoints() {
    const ctx = this.ctx;
    const { kdtId, userId } = ctx;
    let userPoints = 0;
    if (userId) {
      const result = await new PointsReadService(ctx).getCustomerPoints({
        kdtId,
        sourceDTO: {
          sourceId: userId,
          sourceType: 1,
        },
      });
      userPoints = result.currentPoints;
    }
    return userPoints;
  }

  async setUserPoints() {
    this.ctx.setGlobal('userPoints', await this.getUserPoints());
  }

  async setEbizWhiteList() {
    let ebizWhitelist = {};
    const ctx = this.ctx;
    try {
      ebizWhitelist = await ctx.apolloClient.getConfig({
        namespace: 'wsc-h5-vis.whitelist',
        appId: 'wsc-h5-vis',
      });
    } catch (err) {
      /** do nothing */
    }
    ctx.setGlobal('ebizWhitelist', ebizWhitelist);
  }

  async setAudioPlaybgWhiteList() {
    let playbgWhitelist = {};
    const ctx = this.ctx;
    try {
      playbgWhitelist = await ctx.apolloClient.getConfig({
        namespace: 'wsc-h5-vis.playbgWhitelist',
        appId: 'wsc-h5-vis',
      });
    } catch (err) {
      /** do nothing */
    }
    ctx.setGlobal('playbgWhitelist', playbgWhitelist);
  }
}

module.exports = BaseNewController;
