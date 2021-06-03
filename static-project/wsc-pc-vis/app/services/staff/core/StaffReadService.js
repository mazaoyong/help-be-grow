const BaseService = require('../../base/BaseService');

/* com.youzan.staff.core.api.service.StaffReadService -  */
class StaffReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.staff.core.api.service.StaffReadService';
  }

  /**
   *  查询单个员工
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/660697
   *
   *  @param {Object} queryOneStaffParamDTO -
   *  @param {number} queryOneStaffParamDTO.kdtId -
   *  @param {Object} queryOneStaffParamDTO.commonOptions -
   *  @param {number} queryOneStaffParamDTO.adminId -
   *  @param {Object} queryOneStaffParamDTO.extInfoOptions -
   *  @param {string} queryOneStaffParamDTO.source -
   *  @param {Object} queryOneStaffParamDTO.chainOptions -
   *  @param {number} queryOneStaffParamDTO.operatorId -
   *  @param {string} queryOneStaffParamDTO.operator -
   *  @return {Promise}
   */
  async queryOne(queryOneStaffParamDTO) {
    return this.invoke('queryOne', [queryOneStaffParamDTO]);
  }

  /**
   *  查询员工列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/660699
   *
   *  @param {Object} queryPageStaffParamDTO -
   *  @param {number} queryPageStaffParamDTO.kdtId -
   *  @param {Object} queryPageStaffParamDTO.fieldOptions -
   *  @param {number} queryPageStaffParamDTO.pageNo -
   *  @param {Object} queryPageStaffParamDTO.commonOptions -
   *  @param {number} queryPageStaffParamDTO.pageSize -
   *  @param {Object} queryPageStaffParamDTO.extInfoOptions -
   *  @param {string} queryPageStaffParamDTO.source -
   *  @param {Object} queryPageStaffParamDTO.roleOptions -
   *  @param {Object} queryPageStaffParamDTO.chainOptions -
   *  @param {number} queryPageStaffParamDTO.operatorId -
   *  @param {Object} queryPageStaffParamDTO.idRangeOptions -
   *  @param {string} queryPageStaffParamDTO.operator -
   *  @return {Promise}
   */
  async queryPage(queryPageStaffParamDTO) {
    return this.invoke('queryPage', [queryPageStaffParamDTO]);
  }
}

module.exports = StaffReadService;
