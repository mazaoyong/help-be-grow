import { visAjax } from 'fns/new-ajax';

export function getTransferCourseRecord(queryParams) {
  return visAjax('GET', '/edu/adjustcourse/getTransferCourseRecord.json', queryParams);
}