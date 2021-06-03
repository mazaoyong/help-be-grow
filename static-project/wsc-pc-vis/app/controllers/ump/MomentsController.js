const BaseController = require('../base/BaseController');
const MomentsPCService = require('../../services/owl/pc/ceres/CeresPostPCFacade');
const TencentVideoReadService = require('../../services/material/TencentVideoReadService.js');
const CeresPostPCFacade = require('../../services/api/owl/pc/CeresPostPCFacade');
const CeresAdminPCFacade = require('../../services/api/owl/pc/CeresAdminPCFacade');

class MomentsController extends BaseController {
  // 运营后台页
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );
    ctx.setGlobal('lifecycle', lifecycle); // 店铺生命周期

    await ctx.render('ump/moments/index.html');
  }

  // 创建动态
  async createMoments(ctx) {
    const { kdtId } = ctx;
    const operator = this.formatOperator;

    let { command = {} } = ctx.request.body || {};
    command.kdtId = command.kdtId || kdtId;
    command.operator = operator;
    command.user = command.user || { userRole: 2, userId: operator.userId }; // TODO：2为当前默认角色，后期可能出现角色识别
    const res = await new MomentsPCService(ctx).createReview(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 更新动态，校区更新用户动态需要使用总部kdtid
  async updateMoments(ctx) {
    const { kdtId } = ctx;
    const operator = this.formatOperator;

    let { command = {}, rootKdtId = false } = ctx.request.body || {};
    command.operator = operator;
    // command = await ctx.visXss(command, ['textContent']);
    const res = await new MomentsPCService(ctx).updateReview(rootKdtId || kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 删除动态，校区删除用户动态需要使用总部kdtid
  async deleteMoments(ctx) {
    const { kdtId } = ctx;
    const operator = this.formatOperator;

    const { command = {}, rootKdtId = false } = ctx.request.body || {};
    command.operator = operator;
    command.kdtId = command.kdtId || kdtId;
    const res = await new MomentsPCService(ctx).deleteReview(rootKdtId || kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 动态列表
  async findMoments(ctx) {
    const { kdtId } = ctx;
    const operator = this.formatOperator;
    const { pageRequest, query } = ctx.getQueryParse() || {};
    query.operator = operator;
    const res = await new MomentsPCService(ctx).findPostsForStaff(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 回复列表
  async findComments(ctx) {
    const { kdtId } = ctx;
    const operator = this.formatOperator;
    const { pageRequest, query } = ctx.getQueryParse() || {};
    query.operator = operator;
    const res = await new MomentsPCService(ctx).findComments(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 创建评论
  async createComment(ctx) {
    const { kdtId } = ctx;
    const operator = this.formatOperator;

    const { command = {} } = ctx.request.body || {};
    command.operator = operator;
    const res = await new MomentsPCService(ctx).createComment(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 删除评论
  async deleteComment(ctx) {
    const { kdtId } = ctx;
    const operator = this.formatOperator;

    const { command = {} } = ctx.request.body || {};
    command.operator = operator;
    const res = await new MomentsPCService(ctx).deleteComment(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 查询locationInfo
  async findLocationInfo(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.getQueryParse() || {};
    const res = await new MomentsPCService(ctx).findLocationInfo(kdtId, query);
    ctx.json(0, 'success', res);
  }

  // 查询学员列表
  async findStudentsOnLesson(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query } = ctx.getQueryParse() || {};
    const res = await new MomentsPCService(ctx).findStudentsOnLesson(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 查询视频信息
  async generateVideoPlayInfo(ctx) {
    const { kdtId } = ctx;
    const { request } = ctx.getQueryParse() || {};
    request.partnerBizId = request.partnerBizId || kdtId;
    const res = await new TencentVideoReadService(ctx).generateVideoPlayInfo(request);
    ctx.json(0, 'success', res);
  }

  // 获取家校圈配置
  async getCeresConfig(ctx) {
    const { kdtId } = ctx;
    const { user = null } = ctx.getQueryParse() || {};
    const res = await new CeresAdminPCFacade(ctx).getCeresConfig(kdtId, user);
    ctx.json(0, 'success', res);
  }

  // 修改家校圈配置
  async updateCeresConfig(ctx) {
    const { kdtId } = ctx;
    const command = ctx.request.body || {};
    const res = await new CeresAdminPCFacade(ctx).updateCeresConfig(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // B端获取家校圈动态列表
  async findPosts(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse() || {};
    query.operator = this.formatOperator;
    const res = await new CeresAdminPCFacade(ctx).findPosts(kdtId, query);
    ctx.json(0, 'success', res);
  }

  // B端创建动态
  async createReview(ctx) {
    const { kdtId } = ctx;
    const operator = this.formatOperator;

    const { command = {} } = ctx.request.body || {};
    command.kdtId = command.kdtId || kdtId;
    command.operator = operator;
    command.user = { userRole: 2, userId: operator.userId };
    const res = await new CeresPostPCFacade(ctx).createReview(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 获取学员列表
  async findStudentPageWithCustomer(ctx) {
    const { kdtId } = ctx;
    const { pageRequest = {}, query = {} } = ctx.getQueryParse() || {};
    const res = await new CeresAdminPCFacade(ctx).findStudentPageWithCustomer(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }
}

module.exports = MomentsController;
