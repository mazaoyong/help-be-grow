/**
 * 模块所有接口定义文件
 * 注意:方法名字与url最后面方法名字保持一致
 */
import { visAjax } from 'fns/new-ajax';

// 这是一个例子
export function queryAssetOperationBriefInfo<T>(payload) {
  return visAjax<T>('GET', '/student/assets/student-course-assets-change/queryAssetOperationBriefInfo.json', payload);
}

export function queryAssetOperationPage<T>(payload) {
  return visAjax<T>('GET', '/student/assets/student-course-assets-change/queryAssetOperationPage.json', payload);
}
