import { visAjax } from 'fns/new-ajax';
import { isEduHqStore } from '@youzan/utils-shop';

export function getClueList(payload) {
  return visAjax('GET', '/edu/clue/import/getClueList.json', payload);
}

export function getStaffList(payload) {
  return visAjax('GET', '/edu/clue/import/getStaffList.json', payload);
}

// the privilege is judged by backend
export function findPagePowerStaffs(targetKdtId) {
  return visAjax(
    'GET',
    '/commom/edu/findPagePowerStaffs.json',
    {
      cluePowerQuery: {
        powerTypes: [11],
        targetKdtId: targetKdtId || window._global.kdtId,
      },
    },
  );
}

/**
 * 查询课程顾问列表
 * 1:高级管理员、8:普通管理员、2:客服、21:老师、22:课程顾问、24:教务专员
 *
 * @return Promise
 */
export function findStaffByRoles() {
  let roleIds = [1, 2, 8, 21, 22, 24];

  if (isEduHqStore) {
    roleIds = [1, 8, 22, 24, 26];
  }

  return visAjax('GET', '/commom/edu/findStaffByRoles.json', { roleIds });
}

export function findListAllCampus() {
  return visAjax('GET', '/commom/shop/findListAllCampus.json');
}
