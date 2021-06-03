import { visAjax } from 'fns/new-ajax';

export function getLive(data) {
  const { p, ...other } = data;
  data = {
    ...other,
    page: p,
  };
  return visAjax('GET', '/course/live/findPageByCondition.json', data);
}
