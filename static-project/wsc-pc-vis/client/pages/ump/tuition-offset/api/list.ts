/**
 * 模块所有接口定义文件
 * 注意:方法名字与url最后面方法名字保持一致
 */
import { visAjax } from 'fns/new-ajax';

// 分页查询列表数据
export function findTuitionOffsetEventByPage(payload) {
  return visAjax('GET', '/ump/tuition-offset/list/findByPage.json', payload);
}

// 使某活动失效
export function expireTuitionOffsetEventById(payload) {
  return visAjax('PUT', '/ump/tuition-offset/list/invalid.json', payload);
}

// 删除某活动
export function deleteTuitionOffsetEventById(payload) {
  return visAjax('DELETE', '/ump/tuition-offset/list/delete.json', payload);
}
