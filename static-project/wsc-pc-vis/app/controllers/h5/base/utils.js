const { get, isNil } = require('lodash');

const roleIdMap = {
  /** 高级管理员 */
  SUPER_ADMIN: 1,
  /** 普通管理员 */
  ADMIN: 8,
  /** 老师 */
  TEACHER: 21,
  /** 助教 */
  TA: 27,
};

const userHasCertainRole = (userRoleIdList, targetRoleId) => {
  if (!userRoleIdList || userRoleIdList.length === 0 || isNil(targetRoleId)) {
    return false;
  }
  return userRoleIdList.some(role => role && role.roleId === targetRoleId);
};

/** 降级获取角色权限
 * 因权限系统返回的权限不是能力并集，而是角色列表。且返回权限的列表顺序会受到新增店铺角色的影响，故需要暂时修改roleId取数逻辑。
 * ref: https://jira.qima-inc.com/browse/ONLINE-252754
 * 当然这也只是临时解决方案，不能解决根本问题。自定义角色可能仍会存在问题。
 * @param {Array<Record<string, any>>} rigRoleList 用户权限列表
 */

const degradeGetUserRoleId = rigRoleList => {
  if (!rigRoleList || rigRoleList.length === 0) {
    return -1;
  }
  if (userHasCertainRole(rigRoleList, roleIdMap.SUPER_ADMIN)) {
    return roleIdMap.SUPER_ADMIN;
  }
  if (userHasCertainRole(rigRoleList, roleIdMap.ADMIN)) {
    return roleIdMap.ADMIN;
  }
  // copied from previous code base, may cause problems when the user roleId list is in disorder.
  return get(rigRoleList, '[0].roleId', -1);
};

/** 降级获取老师权限
 * @param {Array<Record<string, any>>} rigRoleList 用户权限列表
 */

const degradeGetTeacherRoleId = rigRoleList => {
  if (!rigRoleList || rigRoleList.length === 0) {
    return -1;
  }
  if (userHasCertainRole(rigRoleList, roleIdMap.SUPER_ADMIN)) {
    return roleIdMap.SUPER_ADMIN;
  }
  if (userHasCertainRole(rigRoleList, roleIdMap.ADMIN)) {
    return roleIdMap.ADMIN;
  }
  if (userHasCertainRole(rigRoleList, roleIdMap.TEACHER)) {
    return roleIdMap.TEACHER;
  }
  if (userHasCertainRole(rigRoleList, roleIdMap.TA)) {
    return roleIdMap.TA;
  }
  // copied from previous code base, may cause problems when the user roleId list is in disorder.
  return get(rigRoleList, '[0].roleId', -1);
};

module.exports = {
  degradeGetUserRoleId,
  degradeGetTeacherRoleId,
};
