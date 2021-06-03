// const H5BaseController = require('@youzan/iron-base/app/controllers/base/H5BaseController');
const { H5BaseController } = require('@youzan/iron-base');
const { enterShopForH5 } = require('@youzan/plugin-h5-enter-shop');
// import { H5BaseController } from '@youzan/iron-base';
const _ = require('lodash');
const args = require('zan-utils/url/args');
const { checkChainStore } = require('@youzan/utils-shop');
const BaseService = require('../../services/base/BaseService');
const CreditPolicyReadService = require('../../services/scrm/credit/policy/CreditPolicyReadService');
const ChainProductRelationFacadeService = require('../../services/owl/client/chain/chainproduct/ChainProductRelationFacade');
const ProdReadService = require('../../services/api/shopcenter/shopprod/ProdReadService');
const MpVersionService = require('../../services/channels/MpVersionService');
const PointsReadService = require('../../services/scrm/credit/points/PointsReadService');

/**
 * Project Base Controller
 */
class BaseController extends H5BaseController {
  async init() {
    await super.init();

    this.ctx.initH5Redirect();
    // 只有页面请求才需要初始化的数据
    if (!this.ctx.acceptJSON) {
      this.checkVipDomain();
      try {
        await Promise.all([
          this.setShopMetaInfo(), // 设置店铺元信息
          this.initPlatform(),
          this.initOpenAppConfig(),
          this.initMpAccount(),
          this.initShopSettings(),
          this.initMpData(),
          this.initGlobalTheme(),
          this.initGlobalThemeType(),
          this.initShopTypeAndLifeCycle(),
          this.getMpVersion(),
          this.setShopConfigs(),
          this.initFooter(),
        ]);
      } catch (error) {
        this.ctx.visLogger.warn('[init] error', error);
      }
      this.initKdtId();
      this.initGlobalState();
      this.initGlobalUrl();
      this.initGlobal();
      this.setWeappInfo();
      this.setVisBuyer();
      this.setPointsName();
      this.loggerUainfo();
    }
  }

  get buyer() {
    return this.ctx.visBuyer;
  }

  async checkRedirectToShopDomain(ctx) {
    await ctx.baseCheckRedirect();
  }

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

  initKdtId() {
    const kdtId = this.ctx.kdtId;
    this.ctx.setGlobal('kdt_id', kdtId);
    this.ctx.setState('kdt_id', kdtId);
  }

  async initFooter() {
    const ctx = this.ctx;
    await this.initBaseFooter();
    const footerHtml = ctx.getState('footerHtml') || '';
    ctx.setState('footerHtml', footerHtml.replace(/\/\/img\.yzcdn\.cn/, '//img01.yzcdn.cn'));
  }

  /**
   * 初始化自定义公共 global || state
   * 迁移自 iron
   */
  async initGlobalState() {
    const ctx = this.ctx;
    const platformInfo = ctx.getState('platformInfo') || {};

    const { is_mobile: isMobile, platform_version: platformVersion, mobile_system: mobileSystem } = platformInfo;

    this.ctx.setGlobal('platform', ctx.platform);

    this.ctx.setGlobal('mobile_system', mobileSystem);
    this.ctx.setGlobal('is_mobile', isMobile);
    this.ctx.setGlobal('platform_version', platformVersion);

    // node 环境
    let runMode = '';
    if (process.env.NODE_ENV === 'pre') {
      runMode = 'pre';
    } else if (process.env.NODE_ENV === 'prod') {
      runMode = 'online';
    } else if (process.env.NODE_ENV === 'development') {
      runMode = 'dev';
    } else {
      runMode = 'qatest';
    }
    this.ctx.setGlobal('run_mode', runMode);
  }

  /**
   * 初始化theme type
   */
  async initGlobalThemeType() {
    const ctx = this.ctx;
    let type = '0';
    try {
      const globalTemplate = await this.callService(
        'iron-base/showcase.GlobalStyleService',
        'getGlobalStyleWithDefault',
        this.ctx.kdtId,
      );
      type = globalTemplate.type || '0';
    } catch (error) {
      ctx.visLogger.warn('[initGlobalThemeType]', error, {
        type,
      });
    }
    ctx.setGlobal('global_template_type', type);
  }

  /**
   * 初始化url
   */
  initGlobalUrl() {
    const ctx = this.ctx;
    ctx.setGlobal('wap_url', ctx.getGlobal('url'));
  }

  /**
   * 初始化 shop_type
   */
  async initShopTypeAndLifeCycle() {
    const ctx = this.ctx;
    const shopResult = await new ProdReadService(ctx).queryShopProd(ctx.kdtId);
    if (shopResult) {
      ctx.setEnv('lifecycleStatus', shopResult.lifecycleStatus);
    }
  }

  /**
   * 获取 shop footer
   */
  async getFooterJson(ctx) {
    const kdtId = ctx.kdtId;
    const offlineId = ctx.offlineId;
    this.validator.required(kdtId, '参数 kdt_id 不能为空');
    const result = await this.callService('shop.ShopFooterService', 'getFooterInfo', kdtId, offlineId);

    ctx.setGlobal('footer_config', result);
    ctx.setState('footer_config', result);
  }

  // 初始化weapp信息
  setWeappInfo() {
    const ctx = this.ctx;
    const { url } = ctx;
    const appId = args.get('appId', url);
    const openId = args.get('openId', url);

    if (appId && openId) {
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

  async setUserPoints() {
    const ctx = this.ctx;
    const { kdtId, userId } = ctx;
    if (!userId) {
      ctx.setGlobal('userPoints', 0);
    } else {
      const result = await new PointsReadService(ctx).getCustomerPoints({
        kdtId,
        sourceDTO: {
          sourceId: userId,
          sourceType: 1,
        },
      });
      ctx.setGlobal('userPoints', result.currentPoints);
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
   * 设置自定义积分名称
   */
  async setPointsName() {
    const ctx = this.ctx;
    const dto = {
      creditDefinitionId: 0,
      kdtId: ctx.kdtId || 0,
    };

    try {
      const list = await new CreditPolicyReadService(ctx).getName(dto);
      this.ctx.setGlobal('visPointsName', list.name || '积分');
    } catch (err) {
      ctx.visLogger.warn('获取积分名错误', err);
      this.ctx.setGlobal('visPointsName', '积分');
    }
  }

  /**
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

  async setShopMetaInfo() {
    const { kdtId } = this.ctx;

    let shopMetaInfo = {};
    try {
      shopMetaInfo = await this.callService('iron-base/shop.ShopMetaReadService', 'getShopMetaInfo', kdtId);
    } catch (err) {
      this.ctx.visLogger.warn('获取店铺元信息错误', err);
    }

    this.ctx.setGlobal('shopMetaInfo', shopMetaInfo);
    this.ctx.setEnv('shop_type', shopMetaInfo.shopType);
  }

  /**
   * ACL
   */
  async baseAcl(aclConf) {
    const ctx = this.ctx;
    if (ctx.isWeapp) {
      return;
    }
    try {
      const queryStr = Object.assign(
        {
          kdtId: ctx.kdtId,
          scenes: 'paidcontent',
        },
        aclConf,
      );
      const result = await this.callService('iron-base/uic.AclService', 'invokeAcl', queryStr);

      if (result) {
        // 上报 acl 调用日志
        try {
          ctx.localLog(
            'log',
            ctx.prettyjson({
              user: ctx.logUserStr,
              name: 'baseAcl',
              args: queryStr,
              res: result,
            }),
          );
        } catch (error) {
          ctx.visLogger.error('[baseAcl] error', error);
        }

        if (result.aclCode === 200) {
          this.ctx.setLocalSession(result.session);

          this.setVisBuyer();
          ctx.setGlobal('acl_scenes_auth_result', result && result.aclScenesAuthResult);

          const buyerId = (result.session.buyer && result.session.buyer.id) || 0;
          const youzanUserId = result.session.youzan_user_id || 0;
          ctx.setGlobal('user', {
            has_login: (buyerId || youzanUserId) > 0,
            has_bind: buyerId > 0,
          });

          this.ctx.setGlobal('buyer', result.session.buyer || {});
          if (result.session && !result.session.buyer) {
            ctx.logger.debug('buyer对象为空', '', {
              url: ctx.url,
              method: ctx.method,
              originalUrl: ctx.originalUrl,
              host: ctx.host,
              headers: ctx.headers,
              query: ctx.query,
              requestBody: ctx.request.body,
              session: result.session,
            });
          }
          const fansInfo = result.fansInfo;
          this.ctx.setEnv('fans_type', fansInfo.fansType);
          this.ctx.setEnv('fans_id', fansInfo.fansId);
          this.ctx.setEnv('fans_nickname', fansInfo.fansNickname);
          this.ctx.setEnv('fans_picture', fansInfo.fansPicture);
          this.ctx.setEnv('fans_token', fansInfo.fansToken);
          this.ctx.setEnv('is_fans', fansInfo.isFans);
          this.ctx.setEnv('verify_weixin_openid', fansInfo.verifyWeixinOpenid);

          this.ctx.setEnv('youzan_fans_id', fansInfo.youzanFansId);
          this.ctx.setEnv('youzan_fans_nickname', fansInfo.youzanFansNickname);
          this.ctx.setEnv('youzan_fans_picture', fansInfo.youzanFansPicture);
          this.ctx.setEnv('mp_id', result.mpId);
          this.ctx.setEnv('no_user_login', result.noUserLogin);
          this.ctx.setEnv('need_ajax_login', result.needAjaxLogin);
          this.ctx.setEnv('change_password_url', result.changePasswordUrl || '');
          this.ctx.setEnv('cross_domain_flag', result.crossDomainStatus);
          this.ctx.setEnv('yz_userinfo', result.yzUserinfo);
          this.ctx.setEnv('youzan_user_id', result.youzanUserId);
          this.ctx.setEnv('bind_old_user_id', result.bindOldUserId);
          this.ctx.setEnv('buyer_id', result.buyerId);

          if (result.authType > 100) {
            this.ctx.setGlobal('user_id', result.youzanUserId);
          }

          this.ctx.setGlobal('wxpay_env', result.wxpayEnv);

          let mpData;
          if (ctx.getState('mpData')) {
            mpData = Object.assign(ctx.getState('mpData') || {}, result.sellerMpInfo);
          } else {
            mpData = result.sellerMpInfo || {};
          }
          mpData.team_name = mpData.shopName || ''; // iron 里有这个

          const safeShopData = _.omit(mpData, ['contactCountryCode', 'contactMobile', 'contactName', 'contactQQ']);
          this.ctx.setState('mpData', safeShopData);
          this.ctx.setGlobal('mp_data', safeShopData, true);

          ctx.visLogger.info('[baseAcl]', '', { args: queryStr, result });
        } else if (+result.aclCode === 302) {
          this.ctx && this.ctx.redirect(result.redirectUrl);
          return 'aclRedirect';
        } else if (result.aclCode === 0) {
          // TODO
        } else {
          // TODO
        }
      }
    } catch (e) {
      console.log(e);
      if (e.errorContent) {
        // TODO
        // 没想好怎么处理，暂时先这么处理
        if (e.errorContent.code === 135700006) {
          // 平台类型暂不支持
          throw e;
        } else if (e.errorContent.code === 135700001) {
          // 参数为空
          throw e;
        } else if (e.errorContent.code === 135700003) {
          // 系统开了个小差, 请稍候重试哦
          throw e;
        } else if (e.errorContent.code === 135700004) {
          // sessionId不能为空
          throw e;
        } else if (e.errorContent.code === 135700005) {
          // 获取店铺数据失败
          throw e;
        }
      } else {
        throw e;
      }
    }
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

  // webview跳小程序原生且原生代码有改动必须根据版本号判断
  async getMpVersion() {
    const ctx = this.ctx;

    if (!ctx.isWeapp) {
      ctx.setEnv('weappVersion', '');
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
    res && ctx.setEnv('weappVersion', res.releaseVersion);
  }

  async getWeappConfigJson(ctx) {
    const params = {
      kdtId: ctx.kdtId,
    };

    const result = await new BaseService(ctx).getWeappConfig(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 连锁-根据校区（或总店）alias拿校区alias
   */

  async getChainCampusTargetAlias(query) {
    if (query.sourceProductAlias) {
      try {
        const result = await new ChainProductRelationFacadeService(this.ctx).getCampusProductByCampus(query);
        let targetAlias = '';
        if (result && result.campusProductAlias) {
          targetAlias = result.campusProductAlias;
        } else {
          this.ctx.visLogger.info(
            `教育连锁商品详情获取失败：sourceKdtId:${query.sourceKdtId}, sourceProductAlias:${query.sourceProductAlias}, targetKdtId:${query.targetKdtId}`,
          );
        }
        return targetAlias;
      } catch (error) {
        this.ctx.visLogger.info(
          `教育连锁商品详情获取失败：sourceKdtId:${query.sourceKdtId}, sourceProductAlias:${query.sourceProductAlias}, targetKdtId:${query.targetKdtId}`,
        );
        return this.ctx.redirect('/wscvis/edu/empty-page');
      }
    }
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
}

module.exports = BaseController;
// export = BaseController;
