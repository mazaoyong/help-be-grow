import qs from 'qs';

interface IGetStudentDetailUrlParams {
  studentId: number | string;
  params?: Record<string, any>;
}

const BASE_URL = `https:${_global.url.v4}`;
const PATH_NAME = '/vis/edu/page/student#/detail/';
// const PATH_NAME = '/vis/edu/student/detail';

export default function getStudentDetailUrl(data: IGetStudentDetailUrlParams): string {
  const { studentId, params = {} } = data;
  const paramsWithSource = Object.assign({}, params, { source: 'ability-center' });
  if (studentId) {
    const queryString = qs.stringify(paramsWithSource, { addQueryPrefix: true });
    const targetUrl = BASE_URL + PATH_NAME + studentId + queryString;
    return targetUrl;
  }
  return '#';
}
