/**
 * 模块所有接口定义文件
 * 注意:方法名字与url最后面方法名字保持一致
 */
import { visAjax } from 'fns/new-ajax';

export function getAssetCourseTimeUpdateInfo<T, F>(payload: F) {
  return visAjax<T>('GET', '/student/assets/student-course-assets-change/getAssetCourseTimeUpdateInfo.json', payload);
}
