import { visAjax } from 'fns/new-ajax';

export function findLittlePage(body) {
  return visAjax('GET', '/student/student/findLittlePage.json', body);
}
