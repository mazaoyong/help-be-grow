import { visAjax } from 'fns/new-ajax';

const prefix = '/edu/appointment';

export default function(method, url, data, options) {
  return visAjax(method, prefix + url, data, options);
}
