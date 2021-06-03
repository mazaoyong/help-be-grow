import { visAjax } from 'fns/new-ajax';

// 创建教育转介绍活动
export function create(payload) {
  return visAjax('POST', '/ump/invite-reward/_textarea_/create.json', payload);
}

// 校验时间范围内是否存在活动
export function checkTimeRange(payload) {
  return visAjax('POST', '/ump/invite-reward/checkTimeRange.json', payload);
}

// 编辑教育转介绍活动
export function edit(payload) {
  return visAjax('POST', '/ump/invite-reward/_textarea_/edit.json', payload);
}

// 转介绍活动列表查询
export function findByPage(payload) {
  return visAjax('GET', '/ump/invite-reward/findByPage.json', payload);
}

// 转介绍活动详情查询
export function getDetail(payload) {
  return visAjax('GET', '/ump/invite-reward/getDetail.json', payload);
}

// 失效教育转介绍活动
export function invalid(payload) {
  return visAjax('POST', '/ump/invite-reward/invalid.json', payload);
}

// 删除教育转介绍活动
export function deleteActivity(payload) {
  return visAjax('POST', '/ump/invite-reward/delete.json', payload);
}

// 查询转介绍活动效果数据(活动维度)
export function findPromotionList(payload) {
  return visAjax('GET', '/ump/invite-reward/findPromotionList.json', payload);
}

// 查询转介绍活动效果数据(活动维度)
export function findNewStudentList(payload) {
  return visAjax('GET', '/ump/invite-reward/findNewStudentList.json', payload);
}

// 获取h5二维码
export function createQrCode(payload) {
  return visAjax('GET', '/ump/invite-reward/createQrCode.json', payload);
}

// 导出新学员列表
export function exportNewStudentData(payload) {
  return visAjax('POST', '/ump/invite-reward/exportNewStudentData.json', payload);
}

// 获取活动数据
export function getSummary(payload) {
  return visAjax('GET', '/ump/invite-reward/getSummary.json', payload);
}

