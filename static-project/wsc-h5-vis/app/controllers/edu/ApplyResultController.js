const EduBaseController = require('./EduBaseController');
const EnrollFacade = require('../../services/owl/enrollform/EnrollFacade');

class ApplyResultController extends EduBaseController {
  // 微页面报名成功后，查询报名信息
  async getRegistrationInfoByIdJson(ctx) {
    const { kdtId, userId } = ctx;
    const id = ctx.query.id;
    const result = await new EnrollFacade(ctx).getRegistrationInfoById(kdtId, userId, id);
    ctx.json(0, 'ok', result);
  }
};

module.exports = ApplyResultController;
