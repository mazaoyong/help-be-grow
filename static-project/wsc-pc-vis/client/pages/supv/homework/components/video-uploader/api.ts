import { visAjax } from 'fns/new-ajax';

export function generateVideoPlayInfo(payload) {
  return visAjax('GET', '/edu/moments/generateVideoPlayInfo.json', payload);
};
