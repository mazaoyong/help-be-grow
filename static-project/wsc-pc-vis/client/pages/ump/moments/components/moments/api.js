import { visAjax } from 'fns/new-ajax';

// 创建动态
export function createMoments(payload) {
  return visAjax('POST', '/edu/moments/createMoments.json', payload);
};

// 更新动态
export function updateMoments(payload) {
  return visAjax('POST', '/edu/moments/updateMoments.json', payload);
};

// 删除动态
export function deleteMoments(payload) {
  return visAjax('POST', '/edu/moments/deleteMoments.json', payload);
};

// 创建回复
export function createComment(payload) {
  return visAjax('POST', '/edu/moments/createComment.json', payload);
};

// 删除回复
export function deleteComment(payload) {
  return visAjax('POST', '/edu/moments/deleteComment.json', payload);
};

// 动态列表
export function findMoments(payload) {
  return visAjax('GET', '/edu/moments/findMoments.json', payload);
};

// 回复列表
export function findComments(payload) {
  return visAjax('GET', '/edu/moments/findComments.json', payload);
};

// 查询locationInfo
export function findLocationInfo(payload) {
  return visAjax('GET', '/edu/moments/findLocationInfo.json', payload);
};

// 查询学员列表
export function findStudentsOnLesson(payload) {
  return visAjax('GET', '/edu/moments/findStudentsOnLesson.json', payload);
};

// 查询视频信息
export function generateVideoPlayInfo(payload) {
  return visAjax('GET', '/edu/moments/generateVideoPlayInfo.json', payload);
};

// 动态管理页获取学员列表
export function findStudentPageWithCustomer(payload) {
  return visAjax('GET', '/edu/moments/findStudentPageWithCustomer.json', payload);
};
