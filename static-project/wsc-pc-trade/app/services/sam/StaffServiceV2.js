const BaseService = require('../base/BaseService');

/**
 * com.youzan.sam.service.StaffServiceV2
 */
class StaffServiceV2 extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.sam.service.StaffServiceV2';
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225053
   *
   *  @param {Object} getStaffRoleDTO -
   *  @param {string} getStaffRoleDTO.biz -
   *  @param {boolean} getStaffRoleDTO.isPhysical - 是否必须是物理关系（主要适配连锁版高级管理员逻辑上属于任何门店员工的场景）
   *  @param {number} getStaffRoleDTO.kdtId -
   *  @param {number} getStaffRoleDTO.pageNo - 分页号
   *  @param {number} getStaffRoleDTO.adminId -
   *  @param {number} getStaffRoleDTO.pageSize - 分页大小
   *  @return {Promise<ITeamAdminItem[]>}
   */
  async findStaffRole(getStaffRoleDTO) {
    return this.invoke('findStaffRole', [getStaffRoleDTO]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225048
   *
   *  @param {object} findStaffsDTO
   *  @param {string} findStaffsDTO.biz -
   *  @param {boolean} findStaffsDTO.isPhysical - 是否必须是物理关系（主要适配连锁版高级管理员逻辑上属于任何门店员工的场景）
   *  @param {number} findStaffsDTO.kdtId -
   *  @param {Array.<Array>} findStaffsDTO.adminIds[] -
   *  @param {number} findStaffsDTO.roleId -
   *  @param {number} findStaffsDTO.pageNo - 分页号
   *  @param {number} findStaffsDTO.pageSize - 分页大小
   *  @param {number} findStaffsDTO.subType -
   *  @param {Array.<Array>} findStaffsDTO.bizList[] -
   *  @param {string} findStaffsDTO.staffExtTypeEnum -
   *  @param {string} findStaffsDTO.keyWord -
   *  @return {object}
   */
  async findStaffsPages(findStaffsDTO) {
    return this.invoke('findStaffsPages', [findStaffsDTO]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1011689
   *
   *  @param {Object} staffRequest -
   *  @param {string} staffRequest.biz - 业务类型
   *  @param {number} staffRequest.kdtId -
   *  @param {number} staffRequest.adminId - 有赞账号id
   *  @param {string} staffRequest.source - 请求来源
   *  @param {number} staffRequest.operatorId - 操作人id
   *  @param {string} staffRequest.operator -
   *  @return {Promise}
   */
  async getStaff(staffRequest) {
    // eslint-disable-next-line no-return-await
    return await this.invoke('getStaff', [staffRequest]);
  }
}

module.exports = StaffServiceV2;
