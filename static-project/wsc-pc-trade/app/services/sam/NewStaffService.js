const BaseService = require('../base/BaseService');

/**
 * 员工信息
 */
class NewStaffService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.sam.gateway.api.service.staff.StaffService';
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1011689
   *
   *  @param {Object} staffRequest -
   *  @param {string} staffRequest.biz - 业务类型
   *  @param {boolean} staffRequest.sources - 来源
   *  @param {number} staffRequest.kdtId -
   *  @param {number} staffRequest.adminId -
   *  @return {Promise<object>}
   */
  async getStaff(staffRequest) {
    return this.invoke('getStaff', [staffRequest], { default: {} });
  }
}

module.exports = NewStaffService;
