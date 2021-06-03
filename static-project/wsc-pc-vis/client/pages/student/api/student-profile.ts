import { visAjax } from 'fns/new-ajax';

// 获取已经添加的学员资料项列表
export function getProfileItemList(query) {
  return visAjax('GET', '/edu/profile/added-list.json', query);
}

// 添加门店的学员资料项列表
export function addProfileItems(attributeAddDTOS) {
  return visAjax('POST', '/edu/profile/add-items.json', { attributeAddDTOS });
}

// 获取设置的学员资料项列表
export function getAllStudentProfileListByKdtId(query) {
  return visAjax('GET', '/edu/profile/all-items.json', query);
}

// 创建资料项
export function createStudentProfileItem(query) {
  return visAjax('POST', '/edu/profile/create.json', query);
}

// 编辑资料项
export function updateStudentProfileItem(query) {
  return visAjax('PUT', '/edu/profile/update.json', query);
}

// 删除资料项
export function deleteStudentProfileItem(query) {
  return visAjax('DELETE', '/edu/profile/delete.json', query);
}

// 根据场景值获取学员资料项
export function getListByApplicableScene(query) {
  return visAjax('GET', '/edu/profile/list-by-scene.json', query);
}

export function getRemoteConf() {
  return visAjax('GET', '/edu/profile/get-remote-conf.json', {});
}
