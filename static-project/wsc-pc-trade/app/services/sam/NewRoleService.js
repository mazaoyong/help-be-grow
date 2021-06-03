const BaseService = require('../base/BaseService');

/**
 * 角色相关
 */
class NewRoleService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.rig.front.api.service.RoleService';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/501922
   *
   *  @param {object} roleReqDTO - 参数集合
   *  @param {number} roleReqDTO.thirdTenantId - 外部id 店铺域为kdtId值
   *  @param {number} roleReqDTO.thirdUserId - 外部用户id 店铺域为adminId值
   *  @param {number} roleReqDTO.roleId - 角色id
   *  @param {number} roleReqDTO.pageNo - 分页号
   *  @param {number} roleReqDTO.pageSize - 分页大小
   *  @param {Array.<Array>} roleReqDTO.namespace - 命名空间
   *  @param {Array.<Array>} roleReqDTO.rigSource - 来源
   *  @return {Promise<Array>}
   */
  async getRoleList(roleReqDTO) {
    return this.invoke('getRoleList', [roleReqDTO], { default: [] });
  }
}

module.exports = NewRoleService;
