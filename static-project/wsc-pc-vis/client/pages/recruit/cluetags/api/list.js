import { visAjax } from 'fns/new-ajax';

export function getTagList(payload) {
  return visAjax('GET', '/edu/clue/getTagList.json', payload);
}

export function createTag(payload) {
  return visAjax('POST', '/edu/clue/createTag.json', payload);
}

export function updateTag(payload) {
  return visAjax('PUT', '/edu/clue/updateTag.json', payload);
}

export function deleteTags(payload) {
  return visAjax('DELETE', '/edu/clue/deleteTags.json', payload);
}

export function transTagGroup(payload) {
  return visAjax('POST', '/edu/clue/transTagGroup.json', payload);
}
