import { visAjax } from 'fns/new-ajax';

export function findPageStudentLessonByAssetNo(data) {
  return visAjax('GET', '/edu/appointment/findPageStudentLessonByAssetNo.json', data);
}