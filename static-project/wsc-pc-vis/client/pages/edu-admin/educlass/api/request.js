import { visAjax } from 'fns/new-ajax';

const prefix = '/edu/educlass';

export default function(method, url, data, options) {
  return visAjax(method, prefix + url, data, options);
}
