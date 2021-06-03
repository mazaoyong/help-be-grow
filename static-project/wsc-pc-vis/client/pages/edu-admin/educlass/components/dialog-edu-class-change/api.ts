/**
 * 模块所有接口定义文件
 * 注意:方法名字与url最后面方法名字保持一致
 */
import { visAjax } from 'fns/new-ajax';

export function getAssetClassUpdateInfo(payload) {
  return visAjax('GET', '/student/assets/student-course-assets-change/getAssetClassUpdateInfo.json', payload);
}
