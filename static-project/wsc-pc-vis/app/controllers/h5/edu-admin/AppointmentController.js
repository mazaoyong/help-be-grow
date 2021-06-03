const BaseController = require('../base/BaseController');
const BusinessAppointmentService = require('../../../services/owl/pc/appointment/BusinessAppointmentService');

class AppointmentController extends BaseController {
  async getUpdateAppointmentResult(ctx) {
    const { kdtId = '', query } = ctx;

    const result = await new BusinessAppointmentService(ctx).getUpdateAppointmentResult(kdtId, query);
    return ctx.json(0, 'ok', result);
  }
}

module.exports = AppointmentController;
