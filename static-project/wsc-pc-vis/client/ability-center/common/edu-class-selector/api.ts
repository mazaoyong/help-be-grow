import { visAjax } from 'fns/new-ajax';

export const getClassList = data => {
  return visAjax('GET', '/edu/educlass/classes.json', data);
};