const BaseService = require('../base/BaseService');

/**
 * 权限角色相关
 */
class RigRoleService extends BaseService {
  // eslint-disable-next-line require-jsdoc-except/require-jsdoc
  get SERVICE_NAME() {
    return 'com.youzan.rig.front.api.service.RoleService';
  }

  /**
   * 获取店铺的角色列表
   * http://zanapi.qima-inc.com/site/service/view/501922
   * @param {number} kdtId
   * @param {number} adminId
   * @param {object} params
   */
  async getRoleList(kdtId, adminId, params = null) {
    // eslint-disable-next-line no-return-await
    return await this.invoke(
      'getRoleList',
      [
        {
          thirdTenantId: `${kdtId}`,
          thirdUserId: `${adminId}`,
          namespace: 'np_yz_shop',
          rigSource: 'retail_node',
          ...params,
        },
      ],
      { default: [] },
    );
  }
}

module.exports = RigRoleService;
