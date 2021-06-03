import { visAjax } from 'fns/new-ajax';

export function getStaffList(data) {
  return visAjax('GET', '/edu/enrollment/getStaffList.json', data);
}