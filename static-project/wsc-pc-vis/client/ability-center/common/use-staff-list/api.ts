import { visAjax } from 'fns/new-ajax';

export function findStaff() {
  return visAjax('GET', '/edu/enrollment/findStaff.json');
}