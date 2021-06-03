import { visAjax } from 'fns/new-ajax';

export function findTransferReason(data) {
  return visAjax('GET', '/edu/clue/findTransferReasonPageByQuery.json', data);
}

export function createTransferReason(data) {
  return visAjax('POST', '/edu/clue/createTransferReason.json', data);
}

export function updateTransferReason(data) {
  return visAjax('POST', '/edu/clue/updateTransferReason.json', data);
}

export function deleteTransferReason(data) {
  return visAjax('POST', '/edu/clue/deleteTransferReason.json', data);
}
