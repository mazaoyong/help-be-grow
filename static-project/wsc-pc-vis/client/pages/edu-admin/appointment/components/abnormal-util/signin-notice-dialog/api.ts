import { visAjax } from 'fns/new-ajax';

export const getBatchSignInTip = data => {
  return visAjax('GET', '/edu-admin/reserve/getBatchSignInTip.json', data);
};

export const getSignInTip = data => {
  return visAjax('GET', '/edu-admin/reserve/getSignInTip.json', data);
};
