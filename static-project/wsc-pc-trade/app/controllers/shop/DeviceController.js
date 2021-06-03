const BaseController = require('../base/BaseController');
const PeripheralApi = require('../../services/retail/PeripheralApi');

class DeviceController extends BaseController {
  async getPrinters(ctx) {
    const { kdtId } = ctx;
    const userInfo = ctx.getLocalSession('userInfo');
    const userId = userInfo.id;
    const result = await new PeripheralApi(ctx).queryPage({
      kdtId: +kdtId,
      adminId: userId,
      equipmentTypeIds: [1001001, 1001003],
      peripheralTypeId: 1001,
      status: 1,
      retailSource: 'wsc-h5-user',
    });
    ctx.json(0, 'ok', result);
  }
}

module.exports = DeviceController;
