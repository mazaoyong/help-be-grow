import { visAjax } from 'fns/new-ajax';

export function findSourceGroupList(payload) {
  return visAjax('GET', '/edu/clue/findSourceGroupList.json', payload);
}

export function createSourceGroup(payload) {
  return visAjax('POST', '/edu/clue/createSourceGroup.json', payload);
}

export function updateSourceGroup(payload) {
  return visAjax('POST', '/edu/clue/updateSourceGroup.json', payload);
}

export function deleteSourceGroup(payload) {
  return visAjax('POST', '/edu/clue/deleteSourceGroup.json', payload);
}
