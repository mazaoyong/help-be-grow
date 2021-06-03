const BaseController = require('../base/BaseController');
const EduPostMDFacade = require('../../../services/owl/ceres/CeresPostMDFacade');

class PosterController extends BaseController {
  async findPostDetail() {
    const ctx = this.ctx;
    const { kdtId } = ctx;

    const query = ctx.getQueryParse();
    query.operator = this.formatOperator;
    query.user = {
      userId: query.operator.userId,
      userRole: 2,
    };

    const data = await new EduPostMDFacade(ctx).findPostDetail(
      kdtId,
      query,
    );

    ctx.json(0, 'ok', data);
  }
}

module.exports = PosterController;
