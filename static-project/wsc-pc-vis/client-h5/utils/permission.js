
import { get } from 'lodash';

/**
 * 根据 Global 中的权限树提取对应 name 的权限
 *
 * @param {...string} names - rig 配置中每一层级的 name
 * @return {boolean} 权限
 */
export const checkAccess = (...names) => {
  let permission = window._global.permission;
  for (const name of names) {
    const nextPermission = get(permission, ['children', name]);
    if (!nextPermission) {
      return false;
    }
    permission = nextPermission;
  }

  return Boolean(get(permission, 'accessible', false));
};
