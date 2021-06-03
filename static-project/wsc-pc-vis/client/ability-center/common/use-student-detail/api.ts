import { visAjax } from 'fns/new-ajax';

export interface IStudentInfoQuery {
  studentId: string | number;
}

export function getDetail(data: IStudentInfoQuery) {
  return visAjax('GET', '/edu/getInfoByIdForHideJson.json', data);
}