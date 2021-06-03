const BaseController = require('../base/BaseController');
const SelfFetchPointService = require('../../services/multistore/SelfFetchPointService');

class SelffetchController extends BaseController {
  async hasSelfFetchPoints(ctx) {
    const { kdtId } = ctx;
    const result = await new SelfFetchPointService(ctx).hasSelfFetchPoints(kdtId);

    return ctx.successRes(result);
  }
}

module.exports = SelffetchController;
