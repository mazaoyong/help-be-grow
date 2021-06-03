import { visAjax } from 'fns/new-ajax';

export function findImportTaskByPage(payload) {
  return visAjax('GET', '/edu/studentImport/findByPage.json', payload);
}

export function getImportTask(payload) {
  return visAjax('GET', '/edu/studentImport/getImportTask.json', payload);
}

export function listRowFieldErrorSummary(payload) {
  return visAjax('GET', '/edu/studentImport/listRowFieldErrorSummary.json', payload);
}
