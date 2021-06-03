const OrderBaseController = require('./OrderBaseController');
const ExpressService = require('../../services/delivery/ExpressService');

class ExpressController extends OrderBaseController {
  async getExpressList(ctx) {
    const result = await new ExpressService(ctx).getExpressList();
    ctx.successRes(result);
  }
}

module.exports = ExpressController;
