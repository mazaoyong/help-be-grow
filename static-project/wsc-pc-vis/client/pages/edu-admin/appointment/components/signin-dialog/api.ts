import { visAjax } from 'fns/new-ajax';

export function batchSignIn(body) {
  return visAjax('POST', '/edu-admin/reserve/signin.json', body);
}

export function singleSignIn(body) {
  return visAjax('POST', '/edu-admin/reserve/studentLessonsSignIn.json', body);
}
