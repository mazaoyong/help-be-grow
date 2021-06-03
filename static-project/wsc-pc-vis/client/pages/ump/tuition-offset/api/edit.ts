/**
 * 模块所有接口定义文件
 * 注意:方法名字与url最后面方法名字保持一致
 */
import { visAjax } from 'fns/new-ajax';

// 检查时间段内是否有相同类型活动
export function checkExistActivity(payload) {
  return visAjax('GET', '/ump/tuition-offset/edit/checkExistActivity.json', payload);
}

// 新建活动
export function create(payload) {
  return visAjax('POST', '/ump/tuition-offset/edit/create.json', payload);
}

// 编辑活动
export function edit(payload) {
  return visAjax('POST', '/ump/tuition-offset/edit/edit.json', payload);
}

// 查看活动详情
export function getTuitionOffsetDetailById(payload) {
  return visAjax('GET', '/ump/tuition-offset/edit/getDetailById.json', payload);
}

// 根据goodsIdList查询商品列表信息，用post防止请求数据长多过长
export function findProductsWithSku(payload) {
  return visAjax('POST', '/ump/tuition-offset/edit/findProductsWithSku.json', payload);
}

// 根据活动id查询活动基本信息
export function getTuitionOffsetBaseStats(payload) {
  return visAjax('GET', '/ump/tuition-offset/stats/getSimpleActivity.json', payload);
}
