/**
 * 转介绍
 */
const BaseController = require('../base/BaseNewController');
const EduIntroductionFacade = require('../../services/owl/client/ump/introduction/EduIntroductionFacade');
class IntroductionController extends BaseController {
  async init() {
    await super.init();
  }

  async studentIdentityCheck(ctx, from = '') {
    const { kdtId, userId, query = {} } = ctx;
    const { alias = '', refereeUserId = '', mobile = '' } = query;
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    try {
      const params = {
        alias,
        userId,
      };
      if (mobile) {
        params.mobile = mobile;
      }
      const res = await new EduIntroductionFacade(ctx).getUserParticipateInfo(kdtId, params);
      if (res.isOldStruct && from === 'old') {
        let url = `/wscvis/ump/introduction/previous-old-student?kdt_id=${kdtId}&alias=${alias}`;
        ctx.redirect(url);
      } else if (res.hasOldStudentInstance && from === 'new' && refereeUserId) {
        let url = refereeUserId
          ? `/wscvis/ump/introduction/old-student?kdt_id=${kdtId}&alias=${alias}&refereeUserId=${refereeUserId}`
          : `/wscvis/ump/introduction/old-student?kdt_id=${kdtId}&alias=${alias}`;
        ctx.redirect(url);
      } else if (from === 'old' || from === 'new') {
        ctx.setGlobal('introStuCheck', res);
      } else if (this.ctx.acceptJSON) {
        return ctx.json(0, 'ok', res);
      }
    } catch (e) {}
  }

  async getOldStudentHtml(ctx) {
    const { kdtId, userId, query = {} } = ctx;
    const alias = query.alias || '';
    await this.studentIdentityCheck(ctx, 'old');
    this.setSpm('introductionOldDetail', 0);
    try {
      const res = await new EduIntroductionFacade(ctx).checkActivityThreshold(kdtId, {
        alias,
        userId,
      });
      ctx.setGlobal('hasThreshold', res);
    } catch (error) {
      ctx.setGlobal('hasThreshold', false);
    }
    await ctx.render('ump/introduction/old-student.html');
  }

  async getInvitePosterHtml(ctx) {
    this.setSpm('introductionPoster', 0);
    await ctx.render('ump/introduction/invite-poster.html');
  }

  async getNewStudentHtml(ctx) {
    await this.studentIdentityCheck(ctx, 'new');
    this.setSpm('introductionNewDetail', 0);
    await this.setGlobalTheme();
    await ctx.render('ump/introduction/new-student.html');
  }

  async getPreviousOldStudentHtml(ctx) {
    const { kdtId, userId, query = {} } = ctx;
    const alias = query.alias || '';
    this.setSpm('introductionOldDetail', 0);
    try {
      const res = await new EduIntroductionFacade(ctx).checkActivityThreshold(kdtId, {
        alias,
        userId,
      });
      ctx.setGlobal('hasThreshold', res);
    } catch (error) {
      ctx.setGlobal('hasThreshold', false);
    }
    await ctx.render('ump/introduction/previous-old-student.html');
  }

  async getOldStudentPreviewHtml(ctx) {
    await ctx.render('ump/introduction/old-student-preview.html');
  }

  async getNewStudentPreviewHtml(ctx) {
    await ctx.render('ump/introduction/new-student-preview.html');
  }

  // 查找店铺中最新正在进行中的活动
  async getIntroductionActivity(ctx) {
    const { kdtId, query = {}, userId } = ctx;
    const { alias } = query || {};
    const res = await new EduIntroductionFacade(ctx).getIntroductionActivity(kdtId, {
      alias,
      userId,
    });
    return ctx.json(0, 'ok', res);
  }

  // 被介绍人（新学员）的活动页面信息
  async getRefereeActivityDetail(ctx) {
    const { kdtId, query = {}, userId } = ctx;
    const { alias, introducerUserId } = query;
    const params = {
      introducerUserId: +introducerUserId,
      userId,
      alias,
    };
    const res = await new EduIntroductionFacade(ctx).getRefereeActivityDetail(+kdtId, params);
    ctx.json(0, 'ok', res);
  }

  // 活动鉴权（只有老学员参与）
  async checkActivityThreshold(ctx) {
    const { kdtId, userId, query = {} } = ctx;
    const { alias } = query;
    const res = await new EduIntroductionFacade(ctx).checkActivityThreshold(kdtId, {
      alias,
      userId,
    });
    ctx.json(0, 'ok', res);
  }

  // 分页查询邀请记录
  async findIntroduceRecord(ctx) {
    const { kdtId, query = {}, userId } = ctx;
    const { countEnabled = true, pageNumber = 1, pageSize = 10, sort = {}, alias } = query;
    const pageRequest = {
      countEnabled,
      pageNumber,
      pageSize,
      sort,
    };
    const introduceRecordQuery = {
      alias,
      userId,
    };
    const res = await new EduIntroductionFacade(ctx).findIntroduceRecord(kdtId, pageRequest, introduceRecordQuery);
    ctx.json(0, 'ok', res);
  }

  // 点赞
  async collectZan(ctx) {
    const { kdtId, query, userId } = ctx;
    const params = {
      alias: query.alias,
      refereeUserId: query.refereeUserId,
      userId,
    };
    const result = await new EduIntroductionFacade(ctx).collectZan(kdtId, params);
    ctx.json(0, 'ok', result);
  }

  // 门槛为需分享时，生成分享记录
  async refereeShareActivity(ctx) {
    const { kdtId, query, userId, visBuyer } = ctx;
    const params = {
      alias: query.alias,
      userId,
      fansType: visBuyer.fansType,
    };

    const result = await new EduIntroductionFacade(ctx).refereeShareActivity(kdtId, params);
    ctx.json(0, 'ok', result);
  }

  // 领取奖励
  async receiveAward(ctx) {
    const { kdtId, query, userId } = ctx;
    const params = {
      alias: query.alias,
      userId,
    };

    const result = await new EduIntroductionFacade(ctx).receiveAward(kdtId, params);
    ctx.json(0, 'ok', result);
  }

  // 查询活动需要的资料项
  async getIntroductionAttribute(ctx) {
    const { kdtId, query } = ctx;

    const result = await new EduIntroductionFacade(ctx).getIntroductionAttribute(kdtId, query.alias);
    ctx.json(0, 'ok', result);
  }

  // 获取验证码
  async sendVerifyCode(ctx) {
    const { kdtId, query, userId } = ctx;
    const params = {
      alias: query.alias,
      mobile: query.mobile,
      userId,
    };

    const result = await new EduIntroductionFacade(ctx).sendVerifyCode(kdtId, params);
    ctx.json(0, 'ok', result);
  }

  // 提交资料项
  async confirmIntroductionAttributeItem(ctx) {
    const { kdtId, userId, visBuyer } = ctx;
    const query = ctx.getPostData();
    const params = {
      alias: query.alias,
      verifyCode: query.verifyCode,
      attributeItems: query.attributeItems,
      introducerUserId: +query.introducerUserId,
      userId,
      fansType: visBuyer.fansType,
    };

    const result = await new EduIntroductionFacade(ctx).confirmIntroductionAttributeItem(kdtId, params);
    ctx.json(0, 'ok', result);
  }

  // 审核图片是否涉黄或涉及政治
  async imageAppraise(ctx) {
    const { url } = ctx.query;
    const res = await new EduIntroductionFacade(ctx).imageAppraise(url);
    ctx.json(0, 'ok', res);
  }

  // 获取活动参与人数
  async getActivityParticipatePeople(ctx) {
    const { kdtId, query = {} } = ctx;
    const { alias, bizScene } = query || {};
    const res = await new EduIntroductionFacade(ctx).getActivityParticipatePeople(kdtId, {
      alias,
      bizScene,
    });
    ctx.json(0, 'ok', res);
  }

  // 获取老学员统计信息
  async getOldStudentSummary(ctx) {
    const { kdtId, userId } = ctx;
    const query = {
      id: ctx.query.id,
      userId,
    };
    const res = await new EduIntroductionFacade(ctx).getOldStudentSummary(kdtId, query);
    ctx.json(0, 'ok', res);
  }

  async getCollectZanUserStatus(ctx) {
    const { kdtId, userId, query = {} } = ctx;
    const { alias, refereeUserId } = query;
    const params = {
      fromUserId: userId,
      toUserId: refereeUserId,
      alias,
    };
    const res = await new EduIntroductionFacade(ctx).getCollectZanUserStatus(kdtId, params);
    ctx.json(0, 'ok', res);
  }

  async refererShareActivity(ctx) {
    const { kdtId, userId, query = {} } = ctx;
    const { alias } = query;
    const params = {
      userId,
      alias,
    };
    const res = await new EduIntroductionFacade(ctx).refererShareActivity(kdtId, params);
    ctx.json(0, 'ok', res);
  }

  async getHelperList(ctx) {
    const { kdtId, userId, query = {} } = ctx;
    const { alias } = query;
    const params = {
      alias,
      refereeUserId: userId,
    };
    const res = await new EduIntroductionFacade(ctx).getHelperList(kdtId, params);
    ctx.json(0, 'ok', res);
  }
}
module.exports = IntroductionController;
