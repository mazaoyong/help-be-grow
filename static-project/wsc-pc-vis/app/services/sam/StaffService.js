const BaseService = require('../base/BaseService');
/**
 */
class StaffService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.sam.service.StaffServiceV2';
  }

  /**
   *  获取权限
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225047
   *
   *  @param {Object} dto -
   *  @param {string} dto.kdtId - 店铺id
   *  @param {string} dto.adminId - 个人id
   *  @param {Object} dto.biz - 业务，有赞教育传'wsc'
   *  @param {Object} dto.staffId - 员工id(新版本跟adminId值相同)
   *  @return {Promise}
   */
  async getStaffPerms(dto) {
    return this.invoke('getStaffPerms', [dto]);
  }

  /**
   *  获取角色
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225053
   *
   *  @param {Object} dto -
   *  @param {string} dto.kdtId - 店铺id
   *  @param {string} dto.adminId - 个人id
   *  @param {Object} dto.biz - 业务，有赞教育传'wsc'
   *  @return {Promise}
   */
  async findStaffRole(dto) {
    return this.invoke('findStaffRole', [dto]);
  }

  /**
   * 获取员工详情
   *
   * @param {Object} getStaffDTO -
   * @param {string} getStaffDTO.biz -
   * @param {number} getStaffDTO.kdtId -
   * @param {number} getStaffDTO.adminId -
   * @return {Promise}
   */
  async getStaff(getStaffDTO) {
    return this.invoke('getStaff', [getStaffDTO]);
  }
}

module.exports = StaffService;
