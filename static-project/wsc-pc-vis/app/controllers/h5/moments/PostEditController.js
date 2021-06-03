const BaseController = require('../base/BaseController');
const EduPostMDFacade = require('../../../services/owl/ceres/CeresPostMDFacade');

class PosterController extends BaseController {
  async getPostById() {
    const ctx = this.ctx;
    const query = ctx.getQueryParse();
    const { kdtId } = ctx;

    const data = await new EduPostMDFacade(ctx).getPostById(
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
      userRole: 2,
      userId: this.formatOperator.userId,
    };

    const data = await new EduPostMDFacade(ctx).createReview(
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
      userRole: 2,
      userId: this.formatOperator.userId,
    };

    const data = await new EduPostMDFacade(ctx).updateReview(
      kdtId,
      query
    );

    ctx.json(0, 'ok', data);
  }

  async findLocationInfo() {
    const ctx = this.ctx;
    const query = ctx.getQueryParse();
    const { kdtId } = ctx;

    const data = await new EduPostMDFacade(ctx).findLocationInfo(
      kdtId,
      query
    );

    ctx.json(0, 'ok', data);
  }
}

module.exports = PosterController;
