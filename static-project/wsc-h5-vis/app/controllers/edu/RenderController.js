const querystring = require('querystring');
const EduBaseController = require('./EduBaseController');
const EduBaseService = require('../../services/edu/EduBaseService');

const setAdminToGlobal = async (ctx) => {
  const isAdmin = await new EduBaseService(ctx).getAdminStatus(ctx.kdtId);
  ctx.setGlobal('wscvis_edu', { is_admin: isAdmin });
};

const setShopConfigToGlobal = async (ctx) => {
  const [shopConfig] = await new EduBaseService(ctx).getShopConfigAndTeamStatus(ctx.kdtId);
  ctx.setGlobal('shop_config', shopConfig);
};

class RenderController extends EduBaseController {
  /**
   * 商品详情模版
   */
  async getProdDetailHtml(ctx) {
    let inWhiteList = true;
    if (process.env.NODE_ENV === 'pre' || process.env.NODE_ENV === 'prod') {
      try {
        inWhiteList = await this.callService(
          'iron-base/common.GrayReleaseService', 'isInGrayReleaseByKdtId', 'edu_detail_refactor', +ctx.kdtId);
      } catch (error) {
        inWhiteList = false;
      }
    }
    if (inWhiteList) {
      // forceOld 用来调试，强制不进入新商详
      const { alias, kdt_id: kdtId, forceOld, ...other } = ctx.query;
      if (!forceOld) {
        const query = querystring.stringify(other);
        ctx.redirect(`/wscvis/course/detail/${alias}?kdt_id=${ctx.kdtId || kdtId}${query && `&${query}`}`);
        return;
      }
    }

    await setShopConfigToGlobal(ctx);
    await this.setGlobalTheme();
    await this.setPointsName();
    await setAdminToGlobal(ctx);
    if (ctx.isGuang) {
      await this.needPlatformAcl();
    } else {
      await this.baseAcl({
        useAjaxLogin: true,
      });
    }
    const sls = ctx.query.sls;
    let alias = ctx.query.alias;
    // 连锁进店逻辑
    const subKdtId = await this.getAutoEnterCampusInfo();
    if (subKdtId) {
      const targetAlias = await this.getChainCampusTargetAlias({
        sourceKdtId: ctx.kdtId,
        targetKdtId: subKdtId,
        sourceProductAlias: ctx.query.alias || '',
      });
      if (targetAlias) {
        alias = targetAlias;
        return ctx.redirect(`${ctx.path}?alias=${targetAlias}&kdt_id=${subKdtId}`);
      } else {
        // 空白页路由
        return ctx.redirect('/wscvis/edu/empty-page');
      }
    }
    if (sls) await this.bindCustomerRelationJson(sls, subKdtId);
    if (alias) await this.getShareIcon(ctx, alias);
    ctx.setGlobal('showVisitGift', true); // 发券宝
    ctx.setGlobal('visitGiftSource', 2); // 1: 主页， 2: 商品详情
    await ctx.render('edu/prod-detail.html', { title: '\u200E' });
  }

  // 地址列表页
  async getAddressListHtml(ctx) {
    await setAdminToGlobal(ctx);
    await this.hideFooter();
    await ctx.render('edu/address-list.html', { title: '上课地点' });
  }

  // 地址页
  async getMapHtml(ctx) {
    await ctx.render('edu/map.html', { title: '地址页' });
  }

  // 下单页
  async getOrderConfirmHtml(ctx) {
    await this.initGlobalTheme();
    await setAdminToGlobal(ctx);
    await this.setPointsName();
    await ctx.render('edu/order-confirm.html', { title: '确认订单' });
  }

  // 教师详情页面
  async getMasterDetail(ctx) {
    await this.initGlobalTheme();
    await setAdminToGlobal(ctx);
    await ctx.render('edu/master-detail.html', { title: '教师详情' });
  }

  // 支付状态
  async getPaidStatus(ctx) {
    await this.initGlobalTheme();
    await ctx.render('edu/paid-status.html');
  }

  // 学员列表
  async getStudentList(ctx) {
    await this.initGlobalTheme();
    await this.hideFooter();
    await ctx.render('edu/student-list.html');
  }

  /**
   * 编辑学员
   */
  async renderStudentEdit(ctx) {
    const { from } = ctx.query;
    if (from === 'studentCert') {
      await this.needMobileAcl();
    }
    await this.initGlobalTheme();
    await this.hideFooter();
    await ctx.render('edu/student-edit.html');
  }

  // 全部课程列表
  async getAllCourseIndex(ctx) {
    await ctx.render('edu/all-course.html');
  }

  async getCourseScheduleHtml(ctx) {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    // await this.initGlobalTheme();
    await this.setGlobalTheme();
    await ctx.render('edu/course-schedule.html');
  }

  // 拼团详情页
  async renderGrouponDetailHtml(ctx) {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });

    await this.initGlobalTheme();
    await this.hideFooter();
    await ctx.render('edu/groupon-detail.html');
  }

  // 评价列表页
  async renderEvalutionListHtml(ctx) {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    await this.setGlobalTheme();
    await ctx.render('edu/evaluation-list.html');
  }

  // 评价详情页
  async renderEvalutionDetailHtml(ctx) {
    await this.setGlobalTheme();
    await ctx.render('edu/evaluation-detail.html');
  }

  // 创建评价页
  async renderEvalutionCreateHtml(ctx) {
    await this.setGlobalTheme();
    await ctx.render('edu/evaluation-create.html');
  }

  // 预约列表页
  async getAppointmentListHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/appointment/list.html');
  }

  // 预约页
  async getAppointmentCreateHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/appointment/create.html');
  }

  // 预约结果页
  async getAppointmentResultHtml(ctx) {
    await this.baseAcl();
    await ctx.render('edu/appointment/result.html');
  }

  // 预约记录页
  async getAppointmentRecordsHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/appointment/records.html');
  }

  // 预约详情页
  async getAppointmentDetailHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/appointment/detail.html');
  }

  // 学习记录页
  async getStudyRecordsHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/study-records.html');
  }

  // 签到列表页
  async renderSignInListHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    // 连锁进店逻辑
    const subKdtId = await this.getAutoEnterCampusInfo();
    if (subKdtId) {
      return ctx.redirect(`${ctx.path}?kdt_id=${subKdtId}`);
    }

    const lifecycleStatus = ctx.getState('lifecycleStatus');

    // 歇业、打烊、删除状态都会进到打烊页面
    if (['pause', 'close', 'delete'].includes(lifecycleStatus)) {
      return ctx.redirect(`/v2/common/error/closed?kdt_id=${ctx.kdtId}`);
    } else {
      await ctx.render('edu/sign-in-list.html');
    }
  }

  // 签到详情页
  async renderSignInResultHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/sign-in-result.html');
  }

  // 签到详情页
  async renderSignInAssetsHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/sign-in-assets.html');
  }

  // 线下课主页
  async getCourseIndex(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    // await this.hideFooter();
    await ctx.render('edu/course.html');
  }

  // 线下课-上课记录
  async getCourseRecordIndex(ctx) {
    await this.baseAcl();
    // await this.hideFooter();
    await ctx.render('edu/course-record.html');
  }

  // 线下课-变更明细
  async getCourseChangeIndex(ctx) {
    await this.baseAcl();
    // await this.hideFooter();
    await ctx.render('edu/course-change.html');
  }

  // 学生证列表
  async getStudentCardIndex(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    // await this.hideFooter();
    await ctx.render('edu/student/stu-list.html');
  }

  // 学生证编辑
  async getStudentCardEditIndex(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    // await this.hideFooter();
    await ctx.render('edu/student/stu-edit.html');
  }

  // 证书列表
  async getCertificateIndex(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/certificate-list.html');
  }
  // 教育商品列表
  async getGoodsListIndex(ctx) {
    await ctx.render('edu/goods-list.html');
  }

  // 单个课程分组页面
  async getCourseGroupListIndex(ctx) {
    await ctx.render('edu/course-group.html');
  }

  // 我的奖励
  async getRewardListIndex(ctx) {
    await this.initGlobalTheme();
    await ctx.render('edu/reward/list.html');
  }

  // 奖励记录
  async getRewardRecordIndex(ctx) {
    await ctx.render('edu/reward/record.html');
  }

  // 连锁空白页
  async getEmptyPageIndex(ctx) {
    await this.initGlobalTheme();
    await ctx.render('edu/empty-page.html');
  }

  // 报名结果页
  async getApplyResultIndex(ctx) {
    await ctx.render('edu/apply-result.html');
  }

  // 奖励、公众号海报领取课程页
  async getCourseHtml(ctx) {
    await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('edu/get-course.html');
  }

  async getMomentsTimelineHtml(ctx) {
    await ctx.render('edu/moments-timeline.html');
  }

  async getMomentsPosterHtml() {
    this.hideFooter();
    await this.ctx.render('edu/moments/poster.html');
  }

  async getMomentsFeedsHtml() {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    this.hideFooter();
    await this.ctx.render('edu/moments/feeds.html');
  }

  async getMessageBoxHtml() {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    await this.ctx.render('edu/moments/message-box.html');
  }

  async getMomentsFeedDetailsHtml() {
    await this.baseAcl({
      useAjaxLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    await this.ctx.render('edu/moments/detail.html');
  }

  async getMomentsEditHtml() {
    await this.baseAcl({
      useAjaxLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    this.hideFooter();
    await this.ctx.render('edu/moments/post-edit.html');
  }
}

module.exports = RenderController;
