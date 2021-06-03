import { visAjax } from 'fns/new-ajax';

export const createExportRecord = (payload) => visAjax('GET', '/edu/regis/record/createExportRecord.json', payload);

export const findPageExportedReportForm = (payload) => visAjax('POST', '/edu/regis/export/findPageExportedReportForm.json', payload);
