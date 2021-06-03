const BaseController = require('../../controllers/base/BaseNewController');
const MpService = require('../../services/owl/api/MpService');

class MpController extends BaseController {
  async getMpFollowStatus(ctx) {
    const { kdtId = 0, buyerId = 0 } = ctx;
    const result = await new MpService(ctx).checkMpFollow(kdtId, buyerId);
    ctx.json(0, 'ok', result);
  }
}

module.exports = MpController;
