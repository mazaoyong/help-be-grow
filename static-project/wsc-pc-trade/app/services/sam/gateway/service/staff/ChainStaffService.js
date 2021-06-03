const BaseService = require('../../../../base/BaseService');

/**
 * com.youzan.sam.gateway.api.service.staff.ChainStaffService
 */
class ChainStaffService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.sam.gateway.api.service.staff.ChainStaffService';
  }

  /**
   *  搜索连锁员工
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/419823
   *
   *  @param {Object} queryChainStaffRequest -
   *  @param {number} queryChainStaffRequest.kdtId - 店铺id(carmen token中获取)
   *  @param {number} queryChainStaffRequest.pageSize -
   *  @param {string} queryChainStaffRequest.source - 请求来源
   *  @param {number} queryChainStaffRequest.orgId -
   *  @param {string} queryChainStaffRequest.operator -
   *  @param {string} queryChainStaffRequest.biz - 业务类型
   *  @param {Array.<Array>} queryChainStaffRequest.roleIds[] -
   *  @param {Array.<Array>} queryChainStaffRequest.orgIds[] -
   *  @param {number} queryChainStaffRequest.pageNo -
   *  @param {number} queryChainStaffRequest.adminId - 有赞账号id
   *  @param {number} queryChainStaffRequest.depId -
   *  @param {number} queryChainStaffRequest.targetKdtId - 目标kdtId
   *  @param {string} queryChainStaffRequest.keyword -
   *  @param {number} queryChainStaffRequest.operatorId - 操作人id(carmen token中获取)
   *  @return {Promise}
   */
  async search(queryChainStaffRequest) {
    return this.invoke('search', [queryChainStaffRequest]);
  }
}

module.exports = ChainStaffService;
