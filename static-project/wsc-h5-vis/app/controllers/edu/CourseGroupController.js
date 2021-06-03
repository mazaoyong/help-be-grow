const BaseController = require('../base/BaseController');
const CourseGroupFacade = require('../../services/edu/CourseGroupService');

class CourseGroupController extends BaseController {
  async findItemGroupPageForWym(ctx) {
    const { query } = ctx;
    const { pageNumber, pageSize, alias, kdtId } = query;

    const _kdtId = kdtId || ctx.kdtId;

    const itemQuery = {
      alias,
      kdtId: _kdtId,
      buyerId: ctx.buyerId,
    };
    const pageRequest = {
      pageNumber,
      pageSize,
    };

    const res = await new CourseGroupFacade(ctx).findItemGroupPageForWym(
      ctx.kdtId,
      pageRequest,
      itemQuery
    );
    ctx.json(0, 'ok', res);
  }
}

module.exports = CourseGroupController;
