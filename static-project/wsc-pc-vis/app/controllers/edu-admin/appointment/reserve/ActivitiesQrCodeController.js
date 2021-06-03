const BaseController = require('../../../base/BaseController');
const ActivitiesQrCodeService = require('../../../../services/saas/messages/biz/misc/qr/ActivitiesQrCodeService');

class ActivitiesQrCodeController extends BaseController {
  // 活码
  async getActivityName(ctx) {
    const kdtId = ctx.kdtId;
    const { activityId, sourceKdtId } = ctx.getQueryParse();

    const res = await new ActivitiesQrCodeService(ctx).getActivityName(sourceKdtId || kdtId, activityId);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = ActivitiesQrCodeController;
