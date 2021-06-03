const EduBaseController = require('./EduBaseController');
const MomentsService = require('../../services/owl/ceres/CeresPostMDFacade');
const MomentsAdminService = require('../../services/api/owl/pc/CeresAdminPCFacade');
const WeappQRCodeService = require('../../services/channels/WeappQRCodeService');

class RenderController extends EduBaseController {
  async findPostDetail() {
    const ctx = this.ctx;
    const query = ctx.getQueryParse();
    query.user = {
      userId: ctx.buyerId,
      userRole: 0,
    };
    query.operator = this.formatOperator;
    const result = await new MomentsService(ctx).findPostDetail(
      ctx.kdtId, query
    );
    ctx.json(0, 'ok', result);
  }

  // 通用生成小程序码接口
  async getCommonWeappCode() {
    const ctx = this.ctx;
    let targetUrl = ctx.query.targetUrl || {};
    let page = ctx.query.page || '';
    let params = {
      targetUrl,
      kdtId: ctx.kdtId,
      page,
    };
    params = JSON.stringify(params);
    const weappQRCodeService = new WeappQRCodeService(ctx);
    const data = await weappQRCodeService.getCodeUltra(ctx.kdtId, 'pages/common/blank-page/index', params);
    ctx.json(0, 'ok', 'data:image/png;base64,' + data.imageBase64);
  }

  async findPostsForUser() {
    const ctx = this.ctx;
    const { kdtId } = ctx;
    // const userId = this.formatOperator.userId;
    const query = ctx.getQueryParse();
    query.operator = this.formatOperator;

    const viewed = query.viewed || {};
    query.viewedUser = {
      userId: viewed.userId || ctx.buyerId,
      userRole: viewed.userRole || 0,
    };

    query.onlySelfRelated = ctx.buyerId === viewed.userId;

    const data = await new MomentsService(ctx).findPostsForUser(
      kdtId,
      query.pageRequest,
      query,
    );

    ctx.json(0, 'ok', data);
  }

  async getFeedListJSON(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const defaultQuery = {
      operator: this.formatOperator,
      onlySelfRelated: false,
    };

    const data = await new MomentsService(ctx).findPostsForUser(
      kdtId,
      query.pageRequest,
      query.query || defaultQuery,
    );

    ctx.json(0, 'ok', data);
  }

  async deleteReview(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.operator = this.formatOperator;

    const data = await new MomentsService(ctx).deleteReview(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async createLike(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.sender = {
      userId: ctx.buyerId,
      userRole: 0,
    };

    query.operator = this.formatOperator;

    const data = await new MomentsService(ctx).createLike(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async deleteLike(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.sender = {
      userId: ctx.buyerId,
      userRole: 0,
    };
    query.operator = this.formatOperator;

    const data = await new MomentsService(ctx).deleteLike(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async createComment(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.sender = {
      userId: ctx.buyerId,
      userRole: 0,
    };
    query.operator = this.formatOperator;

    const data = await new MomentsService(ctx).createComment(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async deleteComment(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.sender = {
      userId: ctx.buyerId,
      userRole: 0,
    };
    query.operator = this.formatOperator;

    const data = await new MomentsService(ctx).deleteComment(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async findMessageBox(ctx) {
    const { kdtId, query, buyerId } = ctx;

    const data = await new MomentsService(ctx).findMessageBox(kdtId, {
      userRole: query.userRole,
      userId: buyerId,
    });

    ctx.json(0, 'ok', data);
  }

  async findUserMessages(ctx) {
    const { kdtId, userId } = ctx;
    const query = ctx.getQueryParse();
    const user = {
      userRole: query.userRole,
      userId,
    };

    const data = await new MomentsService(ctx).findUserMessages(kdtId, query.pageRequest, { user });

    ctx.json(0, 'ok', data);
  }

  async findComments(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();

    const data = await new MomentsService(ctx).findComments(kdtId, query.pageRequest, query);

    ctx.json(0, 'ok', data);
  }

  async getUserInfoJSON(ctx) {
    const { kdtId, query, buyerId } = ctx;
    const { userId } = query;

    const data = await new MomentsService(ctx).getCustomerInfoById(kdtId, userId || buyerId);

    ctx.json(0, 'ok', data);
  }

  async getTeacherInfoJSON(ctx) {
    const { kdtId, query } = ctx;
    const { userId } = query;

    const data = await new MomentsService(ctx).getStaffInfoById(kdtId, userId);

    ctx.json(0, 'ok', data);
  }

  async updateCover(ctx) {
    const { kdtId, buyerId } = ctx;
    const query = ctx.request.body || {};
    query.user = {
      userId: buyerId,
      userRole: 0,
    };

    const data = await new MomentsService(ctx).updateCover(kdtId, query);

    ctx.json(0, 'ok', data);
  }

  async getPostById() {
    const ctx = this.ctx;
    const query = ctx.getQueryParse();
    const { kdtId } = ctx;

    const data = await new MomentsService(ctx).getPostById(
      kdtId,
      query.postId
    );

    ctx.json(0, 'ok', data);
  }

  async createReview() {
    const ctx = this.ctx;
    const query = ctx.request.body;
    const { kdtId } = ctx;

    query.operator = this.formatOperator;
    query.user = {
      userRole: 0,
      userId: this.formatOperator.userId,
    };

    const data = await new MomentsService(ctx).createReview(
      kdtId,
      query
    );

    ctx.json(0, 'ok', data);
  }

  async updateReview() {
    const ctx = this.ctx;
    const query = ctx.request.body;
    const { kdtId } = ctx;

    query.operator = this.formatOperator;
    query.user = {
      userRole: 0,
      userId: this.formatOperator.userId,
    };
    query.kdtId = query.kdtId || query.kdt_id;

    const data = await new MomentsService(ctx).updateReview(
      kdtId,
      query
    );

    ctx.json(0, 'ok', data);
  }

  async getCeresConfig() {
    const ctx = this.ctx;
    const { kdtId } = ctx;

    const user = {
      userRole: 0,
      userId: this.formatOperator.userId,
    };

    const data = await new MomentsAdminService(ctx).getCeresConfig(kdtId, user);

    ctx.json(0, 'ok', data);
  }
}

module.exports = RenderController;
