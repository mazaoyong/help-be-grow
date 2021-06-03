import { visAjax } from 'fns/new-ajax';

export function findClueInRecycleBinByPage({ request, recycleBinQuery }) {
  return visAjax('GET', '/edu/clue/findClueInRecycleBinByPage.json', {
    request,
    recycleBinQuery,
  });
}
