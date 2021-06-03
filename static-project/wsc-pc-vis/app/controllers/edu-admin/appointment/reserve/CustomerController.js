const BaseController = require('../../../base/BaseController');
const CustomerService = require('../../../../services/owl/edu/CustomerService');

class CustomerController extends BaseController {
  // 根据手机号模糊查询
  async searchCustomerByPhoneNumJson(ctx) {
    const kdtId = ctx.kdtId;
    const { phoneNum } = ctx.request.query || {};

    const res = await new CustomerService(ctx).searchCustomerByPhoneNum(kdtId, phoneNum);

    return ctx.json(0, 'ok', res);
  }

  // 新建客户
  async createCustomerJson(ctx) {
    const kdtId = ctx.kdtId;
    const { phoneNum, name } = ctx.request.body || {};

    const res = await new CustomerService(ctx).createCustomer(kdtId, phoneNum, name);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = CustomerController;
