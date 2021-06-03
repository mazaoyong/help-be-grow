interface IGetStudentImportParams {
}

const BASE_URL = `https:${_global.url.v4}`;
const PATH_NAME = '/vis/edu/page/stuimport';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function getStudentImportUrl(_params?: IGetStudentImportParams): string {
  const targetUrl = BASE_URL + PATH_NAME;
  return targetUrl;
}
