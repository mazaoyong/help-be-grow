const BaseController = require('../base/BaseController');
const EduPostMDFacade = require('../../../services/owl/ceres/CeresPostMDFacade');

class TimelineController extends BaseController {
  async findPostsForStaff() {
    const ctx = this.ctx;
    const { kdtId } = ctx;
    const userId = this.formatOperator.userId;
    const query = ctx.getQueryParse();

    const viewed = query.viewed || {};

    const data = await new EduPostMDFacade(ctx).findPostsForStaff(
      kdtId,
      query.pageRequest,
      {
        operator: {
          userId: userId,
        },
        viewedUser: {
          userId: viewed.userId || userId,
          userRole: viewed.userRole || 2,
        },
      },
    );

    ctx.json(0, 'ok', data);
  }

  async findMessageBox() {
    const ctx = this.ctx;
    const { kdtId } = ctx;
    const userId = this.formatOperator.userId;

    const data = await new EduPostMDFacade(ctx).findMessageBox(
      kdtId,
      {
        userRole: 2,
        userId,
      },
    );

    ctx.json(0, 'ok', data);
  }

  async findUserBadge() {
    const ctx = this.ctx;
    const { kdtId } = ctx;
    const userId = this.formatOperator.userId;

    const data = await new EduPostMDFacade(ctx).findUserBadge(
      kdtId,
      {
        userRole: 2,
        userId,
      },
    );

    ctx.json(0, 'ok', data);
  }
}

module.exports = TimelineController;
