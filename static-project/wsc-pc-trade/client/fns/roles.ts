import { ITeamAdminItem } from 'definitions/common/user-role';

/**
 * 检查当前用户多角色场景，是否有目标角色
 * 使用场景：同时是a,b,c角色，业务下需要区分a角色；
 * case1：只关注当前用户是否是a角色 checkTargetRoleByPriority(aRoleId, multiRoles) -> true
 * case2：关注当前用户是否为a角色，但是b角色优先级更高
 *       checkTargetRoleByPriority(aRoleId, multiRoles, [bRoleId]) -> false
 * @param targetRoleId 检查目标角色
 * @param multiRoles 当前用户多角色信息
 * @param heighPriorityRoleIds 高优角色
 * @returns boolean
 */
export const checkUserRoleByRoleId = (
  targetRoleId: number,
  multiRoles: ITeamAdminItem[],
  heighPriorityRoleIds?: number[],
) => {
  let hasTargetRole;
  let hasHightPriorityRole;
  for (const role of multiRoles) {
    if (!hasTargetRole) {
      hasTargetRole = role.roleId === targetRoleId;
    }

    if (heighPriorityRoleIds && !hasHightPriorityRole) {
      hasHightPriorityRole = heighPriorityRoleIds.includes(role.roleId);
    }

    // 存在高优角色
    if (heighPriorityRoleIds && hasHightPriorityRole) {
      break;
    }
    // 不判断高优角色，命中target角色跳出
    if (!heighPriorityRoleIds && hasTargetRole) {
      break;
    }
  }

  return hasHightPriorityRole ? false : hasTargetRole;
};
