import { visAjax } from 'fns/new-ajax';

export function getStaff({ adminId }) {
  return visAjax('GET', '/edu/enrollment/getStaff.json', {
    kdtId: window._global.kdtId,
    adminId,
  });
}