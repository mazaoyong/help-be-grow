const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.sam.gateway.api.service.staff.SingleStaffService
 */
class ChainStaffService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.sam.gateway.api.service.staff.SingleStaffService';
  }

  /**
   *  分页查询单店员工
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/416265
   *
   *  @param {Object} querySingleStaffRequest -
   *  @param {number} querySingleStaffRequest.kdtId - 店铺id(carmen token中获取)
   *  @param {Object} querySingleStaffRequest.needExtra -
   *  @param {string} querySingleStaffRequest.staffExtType -
   *  @param {number} querySingleStaffRequest.pageSize -
   *  @param {string} querySingleStaffRequest.source - 请求来源
   *  @param {string} querySingleStaffRequest.operator -
   *  @param {string} querySingleStaffRequest.biz - 业务类型
   *  @param {Array.<Array>} querySingleStaffRequest.roleIds[] -
   *  @param {number} querySingleStaffRequest.pageNo -
   *  @param {number} querySingleStaffRequest.adminId - 有赞账号id
   *  @param {number} querySingleStaffRequest.targetKdtId - 目标kdtId
   *  @param {string} querySingleStaffRequest.keyword -
   *  @param {number} querySingleStaffRequest.operatorId - 操作人id(carmen token中获取)
   *  @param {string} querySingleStaffRequest.status -
   *  @return {Promise}
   */
  async find(querySingleStaffRequest) {
    return this.invoke('find', [querySingleStaffRequest]);
  }
}

module.exports = ChainStaffService;
