const querystring = require('querystring');
const KnowledgeBaseController = require('./KnowledgeBaseController');
const BaseService = require('../../services/base/BaseService');
const ClientLiveFacade = require('../../services/owl/client/onlinecourse/ClientLiveFacade');
const ClientLiveFacadeV2 = require('../../services/api/owl/api/ClientLiveFacade');
const SalesmanService = require('../../services/owl/ump/salesman/SalesmanService');
const ClientEduProductFacade = require('../../services/owl/client/product/ClientEduProductFacade');
const compareVersions = require('@youzan/utils/string/compareVersions');

class IndexController extends KnowledgeBaseController {
  /**
   * 知识付费index
   */
  async getIndexHtml(ctx) {
    const lowerQuerystring = ctx.querystring.toLowerCase();
    if (lowerQuerystring.includes('livedetail')) {
      let inWhiteList = true;
      if (process.env.NODE_ENV === 'pre' || process.env.NODE_ENV === 'prod') {
        try {
          inWhiteList = await this.callService(
            'iron-base/common.GrayReleaseService', 'isInGrayReleaseByKdtId', 'edu_live_refactor', +ctx.kdtId);
        } catch (error) {
          inWhiteList = false;
        }
      }
      if (inWhiteList) {
        // forceOld 用来调试，强制不进入新商详
        const { alias, kdt_id: kdtId, forceOld, p, page, ...other } = ctx.query;
        if (!forceOld) {
          const query = querystring.stringify(other);
          return ctx.redirect(`/wscvis/course/detail/${alias}?kdt_id=${ctx.kdtId || kdtId}${query && `&${query}`}`);
        }
      }
    }

    if (lowerQuerystring.includes('contentshow')) {
      let inWhiteList = true;
      if (process.env.NODE_ENV === 'pre' || process.env.NODE_ENV === 'prod') {
        try {
          inWhiteList = await this.callService(
            'iron-base/common.GrayReleaseService', 'isInGrayReleaseByKdtId', 'edu_content_refactor', +ctx.kdtId);
        } catch (error) {
          inWhiteList = false;
        }
      }
      if (inWhiteList) {
        // forceOld 用来调试，强制不进入新商详
        const { alias, kdt_id: kdtId, forceOld, p, page, ...other } = ctx.query;
        if (!forceOld) {
          const query = querystring.stringify(other);
          return ctx.redirect(`/wscvis/course/detail/${alias}?kdt_id=${ctx.kdtId || kdtId}${query && `&${query}`}`);
        }
      }
    }

    if (lowerQuerystring.includes('columnshow')) {
      let inWhiteList = true;
      if (process.env.NODE_ENV === 'pre' || process.env.NODE_ENV === 'prod') {
        try {
          inWhiteList = await this.callService(
            'iron-base/common.GrayReleaseService', 'isInGrayReleaseByKdtId', 'edu_column_refactor', +ctx.kdtId);
        } catch (error) {
          inWhiteList = false;
        }
      }
      if (inWhiteList) {
        // forceOld 用来调试，强制不进入新商详
        const { alias, kdt_id: kdtId, forceOld, p, page, ...other } = ctx.query;
        if (!forceOld) {
          const query = querystring.stringify(other);
          return ctx.redirect(`/wscvis/course/detail/${alias}?kdt_id=${ctx.kdtId || kdtId}${query && `&${query}`}`);
        }
      }
    }

    // 好友助力重定向
    if (lowerQuerystring.includes('supportinvitation')) {
      const { alias, kdt_id: kdtId, zanAlias } = ctx.query;
      if (alias && zanAlias) {
        return ctx.redirect(`/wscvis/ump/collect-zan?kdt_id=${ctx.kdtId || kdtId}&alias=${alias}&zanAlias=${zanAlias}`);
      }
    }

    const kdtId = ctx.kdtId;
    const {
      page, alias, wxInfo, sls,
    } = ctx.query;

    // spm 统计埋点
    this.setSpm('uc', kdtId);

    // 有特殊标志 使用微信强制登录
    /**
     * 废弃 知识付费大单页强制微信授权
     */
    if (wxInfo) {
      await this.baseAcl({
        forceOauthLogin: true,
        weixinOauthScope: 'snsapi_userinfo',
      });
    }

    const BaseServiceIns = new BaseService(ctx);
    // im按钮控制
    const [shopConfig] = await BaseServiceIns.getShopConfigAndTeamStatus(kdtId);
    ctx.setGlobal('shop_config', shopConfig);
    ctx.setGlobal('showVisitGift', true); // 发券宝
    ctx.setGlobal('visitGiftSource', 2); // 1: 主页， 2: 商品详情

    if (ctx.isWeapp) {
      await this.needPlatformAcl();
    } else if (ctx.platform === 'weixin') {
      const aclResult = await this.baseAcl({
        forceOauthLogin: true,
        weixinOauthScope: 'snsapi_userinfo',
        scenes: 'paidcontent',
      });

      // 因为底部有 page 的页面跳转，如果不进行判断会导致页面跳转两次再进入 acl 的 302
      if (aclResult === 'aclRedirect') {
        return false;
      }
    }

    // live 需要在重定向之前微信登录
    const initLiveResult = await this.initLive(kdtId, alias, page);
    if (initLiveResult === 'aclRedirect') {
      return false;
    }

    // 专栏内容页预加载优化
    const { query } = ctx;
    if (query.p && typeof query.p === 'string') {
      const path = query.p.toLowerCase();
      const index = ['columnshow', 'contentshow'].indexOf(path);
      if (index >= 0) {
        ctx.setState('pctPrePagePath', ['column-show', 'content-show'][index]);
      }

      try {
        const weappVersion = ctx.getState('weappVersion') || '';
        if (ctx.isWeapp &&
          compareVersions(weappVersion, '2.46.8') >= 0 &&
          ['livedetail', 'liveroom'].includes(path)
        ) {
          // 如果是小程序访问直播详情和直播间，重定向到原生的升级页
          return ctx.redirect(`${ctx.appUrl.vis}/redirect/weapp?path=/packages/paidcontent/live/index`);
        }
      } catch (err) {}
    }

    // 对前端路径做转换
    if (page) {
      let queryStr = ctx.querystring;
      // 防止重复redirect
      queryStr = queryStr.replace('page=', 'p=');
      const redirectUri = `${ctx.appUrl.vis}/knowledge/index?${queryStr}#/${page}?${queryStr}`;
      return ctx.redirect(redirectUri);
    }

    // 页面类型检查
    const queryStr = ctx.querystring;
    const { CONTENT, COLUMN, LIVE } = this.checkPageType(queryStr);

    // 专栏连锁进店（有ContentShow/ColumnShow/LiveDetail情况！）
    let subKdtId = '';
    if (COLUMN || CONTENT || LIVE) {
      subKdtId = await this.getAutoEnterCampusInfo();
      if (subKdtId) {
        const targetAlias = await this.getChainCampusTargetAlias({
          sourceKdtId: ctx.kdtId,
          targetKdtId: subKdtId,
          sourceProductAlias: ctx.query.alias || '',
        });
        if (targetAlias) {
          await this.getShareIcon(ctx, targetAlias);
          if (queryStr.includes('p=columnshow')) {
            return ctx.redirect(`${ctx.appUrl.vis}/knowledge/index?page=columnshow&alias=${targetAlias}&kdt_id=${subKdtId}&qr=paidcolumn_${targetAlias}`);
          }
          if (queryStr.includes('p=contentshow')) {
            return ctx.redirect(`${ctx.appUrl.vis}/knowledge/index?page=contentshow&alias=${targetAlias}&kdt_id=${subKdtId}&qr=paidcontent_${targetAlias}`);
          }
          if (queryStr.includes('p=livedetail')) {
            return ctx.redirect(`${ctx.appUrl.vis}/knowledge/index?page=livedetail&alias=${targetAlias}&kdt_id=${subKdtId}&qr=paidcontent_${targetAlias}`);
          }
        } else {
          // 空白页路由
          return ctx.redirect('/wscvis/edu/empty-page');
        }
      }
    }

    // 分销员绑定相关逻辑处理,只针对内容 专栏 直播三个详情页
    if (COLUMN || CONTENT || LIVE) {
      if (sls) {
        await this.bindCustomerRelationJson(sls, subKdtId || ctx.kdtId);
      }
      await this.getShareIcon(ctx, alias);
    }

    // 获取admin状态
    const isAdmin = await BaseServiceIns.getAdminStatus(kdtId);
    ctx.setGlobal('paidcontent', { is_admin: isAdmin });

    // 对知识付费-专栏&内容判断进店逻辑
    // const queryStr = ctx.querystring;
    // console.log('queryStr--------', queryStr);
    // if (queryStr.includes('p=contentshow') || queryStr.includes('p=columnshow')) {
    //   await this.autoEnterEduSubShopPage();
    // }

    await ctx.render('knowledge/index.html', { title: '\u200E' });
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
  async getShareIcon(ctx, targetAlias) {
    let salesmanInfo = {};
    if (targetAlias) {
      const kdtId = ctx.kdtId;
      const alias = targetAlias.toString().split(',')[0];
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
    }
    ctx.setGlobal('salesmanInfo', salesmanInfo);
  }

  async getInviteCardHtml(ctx) {
    await ctx.render('knowledge/invite-card.html', { title: '分享邀请好友' });
  }

  async getSupportInvitationHtml(ctx) {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    await ctx.render('knowledge/support-invitation.html', { title: '好友助力' });
  }

  async getActivityUpgradingHtml(ctx) {
    await ctx.render('knowledge/activity-upgrading.html', { title: '活动升级中' });
  }

  async initLive(kdtId, alias, page) {
    const ctx = this.ctx;
    let pageName = page;

    const {
      sg,
    } = ctx.query;

    if (sg === 'live') {
      // 直播需要强制授权登录
      const aclResult = await this.baseAcl({
        forceOauthLogin: true,
        weixinOauthScope: 'snsapi_userinfo',
        scenes: 'paidcontent',
      });
      if (aclResult === 'aclRedirect') {
        return 'aclRedirect';
      }

      let user;
      try {
        user = await this.createLiveUser(ctx);
      } catch (error) {
        ctx.visLogger.warn('[直播 live pc 端登录]', error);
      }

      if (!pageName) {
        pageName = ctx.query && ctx.query.p;
      }

      if (!user) {
        return;
      }

      const userType = (user || {}).userType;

      // 如果不是讲师且没有购买
      const buyerId = ctx.buyerId;
      const isSubscriptions = await new BaseService(ctx).getSubscriptions(kdtId, buyerId, alias, 4);

      if (userType === 2 && !isSubscriptions && pageName === 'liveroom') {
        const {
          fansId,
          fansType,
        } = ctx.visBuyer;

        const live = await new ClientEduProductFacade(ctx).getDetail(kdtId, {
          alias,
          fansId,
          fansType,
          userId: buyerId,
        });
        if (!live.isOwnAsset) {
          const redirectUri = `${ctx.appUrl.vis}/knowledge/index?kdt_id=${kdtId}&page=livedetail&alias=${alias}`;
          ctx.redirect(redirectUri);
        }
      }
    }
  }

  /**
   * 创建用户
   */
  async createLiveUser(ctx) {
    const { alias: liveAlias = '' } = ctx.query;

    let {
      fansId = 0,
      fansType = 0,
      finalAvatar: avatar = '',
      finalUsername: nickname = '',
      buyerId: userId,
      openId: uid = ctx.getCookie('openId') || userId + '', // 实际上 uid 已经没用了，兼容老接口
    } = ctx.visBuyer;

    const kdtId = ctx.kdtId;

    // 在连锁情况下通过校区alias置换总部的alias
    const finalLiveAlias = await new ClientLiveFacadeV2(ctx).getCampusAlias(kdtId, liveAlias);

    const ret = await new ClientLiveFacade(ctx).createLiveUser({
      kdtId, buyerId: userId, fansId, fansType, adminId: userId, nickname, avatar, uid, liveAlias,
    });

    let lecturerInfo = {};

    const buyerUid = finalLiveAlias + userId;
    lecturerInfo = await new ClientLiveFacade(ctx).getLectorUserByWxUidV2(kdtId, {
      wxUid: finalLiveAlias + uid,
      liveId: ret.liveId,
      buyerUid,
    });

    ctx.setGlobal('live_alias', finalLiveAlias);
    ctx.setGlobal('live_user_type', ret.userType);
    ctx.setGlobal('live_lector_type', ret.lectorType);
    ctx.setGlobal('live_live_status', ret.liveStatus);
    ctx.setGlobal('live_id', ret.liveId);
    ctx.setGlobal('live_forbidUidList', ret.forbidUidList);
    ctx.setGlobal('live_online_num', ret.liveOnLineNum);
    ctx.setGlobal('live_cover', ret.cover);
    ctx.setGlobal('live_summary', ret.summary);
    ctx.setGlobal('live_title', ret.title);
    ctx.setGlobal('live_start_time', ret.startDate);
    ctx.setGlobal('live_is_live_room_forbid', ret.isLiveRoomForbid);
    ctx.setGlobal('carmen_token', ret.carmenToken);
    ctx.setGlobal('verify_weixin_openid', finalLiveAlias + uid);
    ctx.setGlobal('live_visibility_configs', ret.liveVisibilityConfigs);
    ctx.setGlobal('lecturerInfo', lecturerInfo);
    return ret;
  }

  // 获取用户是否为分销员及分销员状态
  async checkDistributorStatus(ctx) {
    const kdtId = ctx.kdtId;
    const adminId = ctx.buyerId; // adminId即为userId/buyerId，叫adminId的原因是userId是Carmen的关键字

    let result = await new SalesmanService(ctx).register([kdtId, adminId]);
    ctx.setGlobal('distributorStatus', result.status);
  }

  // 教育商品详情页统一查询接口,内容 专栏 直播 统一接口
  // TODO 过渡方案，@小瑞 重构后会替代掉此接口，完成所有详情页面及接口的统一
  async getDetail(ctx) {
    const { kdtId, buyerId, platform } = ctx;
    const { alias, sortType } = ctx.query;
    const isWechatEnvironment = platform === 'weixin';
    const {
      fansId,
      fansType,
    } = ctx.visBuyer;

    let result = await new ClientEduProductFacade(ctx).getDetail(kdtId, {
      alias,
      fansId,
      fansType,
      isWechatEnvironment,
      sortType,
      userId: buyerId,
    });
    ctx.json(0, 'ok', result);
  }

  // 教育商品详情页统一查询接口,内容 专栏 直播 线下课统一接口，精简版，只查询基础信息
  async getSimple(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.query;
    let result = await new ClientEduProductFacade(ctx).getSimple(kdtId, alias);
    ctx.json(0, 'ok', result);
  }

  // ############### tools ###################
  /**
   * 根据querystr确定页面类型: CONTENT COLUMN LIVE
   *
   * @param {*} queryStr querystring
   * @return {Object} 类型与bool对应
   */
  checkPageType(queryStr) {
    return {
      COLUMN: /p=columnshow/i.test(queryStr),
      CONTENT: /p=contentshow/i.test(queryStr),
      LIVE: /p=livedetail/i.test(queryStr),
    };
  }
}

module.exports = IndexController;
