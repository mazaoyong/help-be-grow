import { visAjax } from 'fns/new-ajax';

// 设置评论状态
export function setCommentStatus(data) {
  return visAjax('POST', '/pct/setCommentChosenSticky.json', data);
}

// 批量设置评论状态
export function setbBatchCommentStatus(data) {
  return visAjax('POST', '/pct/setBatchCommentChosenSticky.json', data);
}

// 新增回复
export function addComment(data) {
  return visAjax('POST', '/pct/replyComment.json', data);
}

// 删除自己的评论
export function deleteComment(data) {
  return visAjax('POST', '/pct/deleteComment.json', data);
}

// 获取产品列表（字段映射）
export function getGoodsList(data) {
  const { kdtId } = window._global;

  return visAjax('GET', '/pct/findPageByKdtId.json', {
    kdtId: kdtId,
    pageNum: data.page,
    sortBy: data.sortBy,
  });
}

// 获取评论列表（字段映射）
export function getCommentList(data) {
  const { page, pageSize, contentId, chosenSticky, alias, ...others } = data;
  return visAjax('GET', '/pct/getCommentPageForShop.json', {
    pageNum: page,
    pageSize,
    contentId,
    chosenSticky,
    alias,
    ...others,
  });
}

// 获取评论总数
export function getCommentCount(data) {
  return visAjax('GET', '/pct/page/getNonReadCommentsCount.json', data);
}

// 已读
export function readComment(data) {
  return visAjax('POST', '/pct/readComments.json', data);
}

// 查询校区（分店）列表——不分页
export function findListAllCampus(payload) {
  return visAjax('GET', '/commom/shop/findListAllCampus.json', payload);
}
