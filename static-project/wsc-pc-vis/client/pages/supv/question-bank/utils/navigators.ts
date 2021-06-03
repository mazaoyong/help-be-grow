import qs from 'qs';

const BASE_URL = `https:${_global.url.v4}`;
const PATH_NAME = '/vis/supv/question-bank';

interface IBaseParams extends Record<string, any> {
  type: 'edit' | 'create' | 'duplicate';
  // 分类id
  categoryId: number;
  // 分类名
  categoryName: string;
}
export interface ICreatedParams extends IBaseParams {
  type: 'create';
}
export interface IModifyParams extends IBaseParams {
  type: 'edit' | 'duplicate';
  questionId: number;
}
export type IEditParams = IModifyParams | ICreatedParams;
export function getQuestionEditUrl(params: IEditParams) {
  const qsString = qs.stringify(params, { addQueryPrefix: true });
  return BASE_URL + PATH_NAME + '#/' + params.type + qsString;
}

export function getClassifyManageUrl() {
  return BASE_URL + PATH_NAME + '#/classify-manage';
}

export function getQustionBankImportUrl() {
  return BASE_URL + PATH_NAME + '#/import';
}
