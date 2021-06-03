import { visAjax } from 'fns/new-ajax';
import { IColumn } from '../types';

interface IGetTemplateParams {
  /** 0 学员导入 1 线索 */
  templateType: 0 | 1;
  /** 校区id */
  kdtId?: number;
}

type IGetHeaderParams = IGetTemplateParams;

interface ITemplateCheckParams {
  importFile: {
    /** 文件下载url */
    fileUrl: string;
    /** 是否为私有url */
    privateUrl: boolean;
  };
  templateType: number;
  /** 任务ID（如果是导入前的检测不需要传入） */
  taskId: number;
  /** 校区id */
  kdtId?: number;
}

interface ITemplateCheckByTaskIdParams {
  taskId: number;
}

interface ITemplateCheckByTaskIdResult {
  pass: boolean;
  delItems: any[];
  newItems: any[];
}

/** 获取文件模板动态url */
export function getTemplate(payload: IGetTemplateParams): Promise<{ url: string }> {
  return visAjax('GET', '/edu/studentImport/getTemplate.json', payload);
}

/** 获取当前记录资料项列名 */
export function getHeader(payload: IGetHeaderParams): Promise<IColumn[]> {
  return visAjax('GET', '/edu/studentImport/getHeader.json', payload);
}

/** 获取导入学员基本信息可批量修改的资料项 */
export function getSpecifiedHeader(payload: IGetHeaderParams): Promise<IColumn[]> {
  return visAjax('GET', '/edu/studentImport/getSpecifiedHeader.json', payload);
}

/** 获取资料项变更 */
export function templateCheck(payload: ITemplateCheckParams): Promise<boolean> {
  return visAjax('GET', '/edu/studentImport/templateCheck.json', payload);
}

/** 通过任务ID检测模板是否变更 */
export function templateCheckByTaskId(
  payload: ITemplateCheckByTaskIdParams,
): Promise<ITemplateCheckByTaskIdResult> {
  return visAjax('GET', '/edu/studentImport/templateCheckByTaskId.json', payload);
}

interface IRequestAgainValidate {
  taskId: number;
}

/** 重新校验数据 */
export function againValidate(payload: IRequestAgainValidate): Promise<boolean> {
  return visAjax('GET', '/edu/studentImport/againValidate.json', payload);
}
