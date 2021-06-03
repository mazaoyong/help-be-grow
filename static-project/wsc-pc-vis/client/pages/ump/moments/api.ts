import { visAjax } from 'fns/new-ajax';

// 获取家校圈配置
export function getCeresConfig() {
  return visAjax('GET', '/edu/moments/getCeresConfig.json');
}

// 修改家校圈配置
export function updateCeresConfig(payload) {
  return visAjax('PUT', '/edu/moments/updateCeresConfig.json', payload);
}

// 获取家校圈动态列表
export function findPosts(payload) {
  return visAjax('GET', '/edu/moments/findPosts.json', payload);
}

// 创建动态
export function createReview(payload) {
  return visAjax('POST', '/edu/moments/createReview.json', payload);
}

// 删除动态
export function deleteMoments(payload) {
  return visAjax('POST', '/edu/moments/deleteMoments.json', payload);
};
