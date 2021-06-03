/**
 * 关联商品推荐相关接口
 */
import { visAjax } from 'fns/new-ajax';

// 查询推荐设置
export function findRecommend(data) {
  return visAjax('GET', '/pct/goodsrecommend/recommend.json', data);
}

// 创建顶部推荐
export function createMediaEndingRecommend(data) {
  return visAjax('POST', '/pct/goodsrecommend/mediaEndingRecommend.json', data);
}

// 更新顶部推荐
export function changeMediaEndingRecommend(data) {
  return visAjax('PUT', '/pct/goodsrecommend/mediaEndingRecommend.json', data);
}

// 删除顶部推荐
export function deleteMediaEndingRecommend(data) {
  return visAjax('DELETE', '/pct/goodsrecommend/mediaEndingRecommend.json', data);
}

// 创建底部推荐
export function createPageDetailRecommend(data) {
  return visAjax('POST', '/pct/goodsrecommend/pageDetailRecommend.json', data);
}

// 更新底部推荐
export function changePageDetailRecommend(data) {
  return visAjax('PUT', '/pct/goodsrecommend/pageDetailRecommend.json', data);
}

// 删除底部推荐
export function deletePageDetailRecommend(data) {
  return visAjax('DELETE', '/pct/goodsrecommend/pageDetailRecommend.json', data);
}

// 查询知识列表
export function getGoodsList(data) {
  return visAjax('GET', '/pct/goods-selector/goodslist.json', data);
}

// 查询分组列表
export function getGroupList(data) {
  return visAjax('GET', '/pct/goods-selector/grouplist.json', data);
}
