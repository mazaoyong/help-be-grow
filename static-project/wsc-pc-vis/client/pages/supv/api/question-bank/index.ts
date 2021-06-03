import { visAjax } from 'fns/new-ajax';
import pickBy from 'lodash/pickBy';
import { QuestionType, QuestionLevel } from '@ability-center/supv/question-bank';

import { IQuestionBankListDataType } from '../../question-bank/list/types';
import { IQuestionResponse } from '../../question-bank/edit/types';

interface IQuestionQuery {
  categoryId: number; // 试题直属分类id
  level: QuestionLevel; // 试题难度：(1,简单), (2,普通), (3,较难)
  title: string; // 试题标题（富文本字段）
  type: QuestionType; // 试题类型：(1,单选题),(2,多选题),(3,判断题),(4,填空题),(5,简答题)
}
interface IQuestionListResponse {
  content: IQuestionBankListDataType[];
  pageable: Record<string, any>;
  total: number;
}
export function findPageByCondition(questionQuery: IQuestionQuery, pageRequest: IPageRequest) {
  return visAjax<IQuestionListResponse>('GET', '/supv/question-bank/findPageByCondition.json', {
    questionQuery: pickBy(questionQuery, Boolean),
    pageRequest,
  });
}

interface IDeleteCommand {
  ids: Array<number | string>;
}
export function deleteQuestion(deleteCommand: IDeleteCommand) {
  return visAjax<boolean>('POST', '/supv/question-bank/deleteQuestion.json', { deleteCommand });
}

interface IMoveQuestionCommand {
  ids: Array<number | string>;
  targetCategoryId: number;
}
export function moveQuestion(moveCommand: IMoveQuestionCommand) {
  return visAjax<boolean>('POST', '/supv/question-bank/moveQuestion.json', { moveCommand });
}

export function getQuestionDetail<ResponseType>(query: { id: number }) {
  return visAjax<ResponseType>('GET', '/supv/question-bank/getQuestionDetail.json', query);
}

export function createQuestion(createCommand: IQuestionResponse) {
  return visAjax<boolean>('POST', '/supv/question-bank/_textarea_/createQuestion.json', { createCommand });
}
export function updateQuestion(updateCommand: IQuestionResponse) {
  return visAjax<boolean>('POST', '/supv/question-bank/_textarea_/updateQuestion.json', { updateCommand });
}

interface ICategoryQuery {
  needSystemDefault?: boolean;
  parentId: number;
}
interface IPageble {
  countEnabled: boolean;
  offset: number;
  pageNumber: number;
  pageSize: number;
}
interface IImportFileDTO {
  fileUrl: string;
  privateUrl: boolean;
}
interface IQuestionImportCommand {
  categoryId: number;
  importType: number;
  importFile: IImportFileDTO;
  targetKdtId?: number;
}
export function createImportTask(command: IQuestionImportCommand) {
  return visAjax('POST', '/supv/question-bank/createImportTask.json', command);
}

export function findImportTaskByPage({ pageRequest }) {
  return visAjax('GET', '/supv/question-bank/findImportTaskByPage.json', pageRequest);
}

interface ICategoryListResponse {
  total: number;
  content: ICategoryItem[];
  pageable: IPageble;
}
export interface ICategoryItem {
  parentId: number;
  name: string;
  id: number;
  questionCount: number;
}
export function getCategoryList(categoryQuery: ICategoryQuery, pageRequest: IPageRequest) {
  return visAjax<ICategoryListResponse>('GET', '/supv/question-bank/getCategoryList.json', {
    categoryQuery,
    pageRequest,
  });
}

interface IBaseModifyCommand {
  name: string;
}
export function createCategory(createCommand: { parentId: number } & IBaseModifyCommand) {
  return visAjax<boolean>('POST', '/supv/question-bank/createCategory.json', { createCommand });
}

export function updateCategory(updateCommand: { id: number } & IBaseModifyCommand) {
  return visAjax<boolean>('POST', '/supv/question-bank/updateCategory.json', { updateCommand });
}

interface IDeleteCategoryCommand {
  id: number;
}
export function deleteCategory(deleteCommand: IDeleteCategoryCommand) {
  return visAjax<boolean>('POST', '/supv/question-bank/deleteCategory.json', { deleteCommand });
}

interface IMoveCategoryCommand {
  currentId: number;
  targetParentId: number;
}
export function moveCategory(moveCommand: IMoveCategoryCommand) {
  return visAjax<boolean>('POST', '/supv/question-bank/moveCategory.json', { moveCommand });
}
