import { visAjax } from 'fns/new-ajax';

export function findSourcePage(payload) {
  return visAjax('GET', '/edu/clue/findSourcePage.json', payload);
}

export function createSource(payload) {
  return visAjax('POST', '/edu/clue/createSource.json', payload);
}

export function updateSource(payload) {
  return visAjax('POST', '/edu/clue/updateSource.json', payload);
}

export function changeGroup(payload) {
  return visAjax('POST', '/edu/clue/changeSourceGroup.json', payload);
}

export function batchDeleteSource(payload) {
  return visAjax('POST', '/edu/clue/batchDeleteSource.json', payload);
}

export function findListAllCampus() {
  return visAjax('GET', '/commom/shop/findListAllCampus.json');
}
