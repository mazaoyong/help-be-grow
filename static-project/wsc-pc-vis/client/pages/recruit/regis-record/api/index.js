import { visAjax } from 'fns/new-ajax';

export const findDataItems = (payload) => visAjax('GET', '/edu/regis/record/findDataItems.json', payload);

export const findPageRegistrationInfo = (payload) => visAjax('GET', '/edu/regis/record/findPageRegistrationInfo.json', payload);

export const findPageRegFeature = (payload) => visAjax('GET', '/edu/regis/record/findPageRegFeature.json', payload);

export const createExportRecord = (payload) => visAjax('GET', '/edu/regis/record/createExportRecord.json', payload);

export const findPageExportedReportForm = () => visAjax('GET', '/edu/regis/record/findPageExportedReportForm.json');

export const createPreAppointment = (payload) => visAjax('POST', '/edu/regis/record/createPreAppointment.json', payload);
