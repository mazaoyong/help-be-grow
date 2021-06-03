const BaseController = require('../base/BaseController');
const EduPostMDService = require('../../../services/owl/ceres/CeresPostMDFacade');

class FeedsController extends BaseController {
  async getTeacherInfoJSON(ctx) {
    const { kdtId, query, userId } = ctx;
    const { teacherId } = query;

    const data = await new EduPostMDService(ctx).getStaffInfoById(kdtId, teacherId || userId);

    ctx.json(0, 'ok', data);
  }

  async getFeedListJSON(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const defaultQuery = {
      operator: this.formatOperator,
      onlySelfRelated: false,
    };

    const data = await new EduPostMDService(ctx).findPostsForStaff(
      kdtId,
      query.pageRequest,
      query.query || defaultQuery,
    );

    ctx.json(0, 'ok', data);
  }

  async getMessageBoxJSON(ctx) {
    const { kdtId, query, userId } = ctx;

    const data = await new EduPostMDService(ctx).findMessageBox(kdtId, {
      userRole: query.userRole,
      userId,
    });

    ctx.json(0, 'ok', data);
  }

  async findUserMessagesJSON(ctx) {
    const { kdtId, userId } = ctx;
    const query = ctx.getQueryParse();
    const user = {
      userRole: query.userRole,
      userId,
    };

    const data = await new EduPostMDService(ctx).findUserMessages(kdtId, query.pageRequest, { user });

    ctx.json(0, 'ok', data);
  }

  async deleteReview(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.operator = this.formatOperator;

    const data = await new EduPostMDService(ctx).deleteReview(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async createLike(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.operator = this.formatOperator;

    const data = await new EduPostMDService(ctx).createLike(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async deleteLike(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.operator = this.formatOperator;

    const data = await new EduPostMDService(ctx).deleteLike(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async createComment(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.operator = this.formatOperator;

    const data = await new EduPostMDService(ctx).createComment(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async deleteComment(ctx) {
    const { kdtId } = ctx;

    const query = ctx.request.body || {};
    query.operator = this.formatOperator;

    const data = await new EduPostMDService(ctx).deleteComment(kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async findComments(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    query.operator = this.formatOperator;

    const data = await new EduPostMDService(ctx).findComments(kdtId, query.pageRequest, query);

    ctx.json(0, 'ok', data);
  }

  async updateCover(ctx) {
    const { kdtId, userId } = ctx;
    const query = ctx.request.body || {};
    query.user = {
      userId,
      userRole: 2,
    };

    const data = await new EduPostMDService(ctx).updateCover(kdtId, query);

    ctx.json(0, 'ok', data);
  }
}

module.exports = FeedsController;
