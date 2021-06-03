import { visAjax } from 'fns/new-ajax';

export const findLockedPage = data => {
  return visAjax('GET', '/student/student/findLockedPage.json', data);
};

export const batchCancel = data => {
  return visAjax('POST', '/student/student/batchCancel.json', data);
};
