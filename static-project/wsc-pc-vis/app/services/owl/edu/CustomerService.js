const BaseService = require('../../base/BaseService');

/**
 * 客户service
 * @class CustomerService
 * @extends {BaseService}
 */
class CustomerService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.courseschedule.CustomerFacade';
  }

  /**
   *  根据手机号码查询客户
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225193
   *
   *  @param {integer} kdtId - 店铺id
   *  @param {integer} phoneNum - 手机号码
   *  @return {Promise.<Object>} 返回客户信息
   */
  async searchCustomerByPhoneNum(kdtId, phoneNum) {
    return this.invoke('searchCustomerByPhoneNum', [kdtId, phoneNum]);
  }

  /**
   *  创建客户
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/230307
   *
   *  @param {integer} kdtId - 店铺id
   *  @param {string} phoneNum - 手机号码
   *  @param {string} name - 手机号码
   *  @return {Object}
   */
  async createCustomer(kdtId, phoneNum, name) {
    return this.invoke('createCustomer', [kdtId, phoneNum, name]);
  }
}

module.exports = CustomerService;
