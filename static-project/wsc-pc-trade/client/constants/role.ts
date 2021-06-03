/**
 * 角色管理权限相关常量，页面中 _global 不一定有相关的属性，使用时需要在 node 端调用
 */
import { checkUserRoleByRoleId } from 'fns/roles';
import _get from 'lodash/get';

// 店铺角色id
const userRoleIdMap = {
  superAdmin: 1,
  ordinaryAdmin: 8,
  storeAdmin: 4,
  finance: 7,
};

export const teamAdmin = _get(_global, 'teamAdmin', []);
export const isShowMultiStore = _get(_global, 'isShowMultiStore');

/** 是否是店铺财务角色, 同时存在高级管理员或普通管理员时判断为非财务角色 */
export const isFinanceWithPriority = checkUserRoleByRoleId(userRoleIdMap.finance, teamAdmin, [
  userRoleIdMap.superAdmin,
  userRoleIdMap.ordinaryAdmin,
]);

/** 是否是网点管理员，同时存在高级管理员或普通管理员时判断为非网点管理员角色 */
export const isOfflineAdminWithPriority = checkUserRoleByRoleId(
  userRoleIdMap.storeAdmin,
  teamAdmin,
  [userRoleIdMap.superAdmin, userRoleIdMap.ordinaryAdmin],
);

// 多角色场景，只要当前用户拥有网点管理员就会初始化storeId
// 需要区分角色优先级使用 withPriorityStoreId
export const storeId = _get(_global, 'storeId');

export const isOfflineAdmin = isOfflineAdminWithPriority && storeId && storeId > 0;

// 多角色场景根据多角色优先级获取 storeId 同时存在高级管理员或普通管理员判断当前storeId为0
export const withPriorityStoreId = isOfflineAdmin ? storeId : 0;
