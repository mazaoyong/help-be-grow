import { ajax } from '@youzan/vis-ui';
import { IUserExerciseDTO } from 'definitions/api/owl/api/UserExerciseFacade/getUserExercise';
import { IPage, IUserExercisePageDTO } from 'definitions/api/owl/api/UserExerciseFacade/findUserExercisePage';
/** 学员端获取作业本详情接口 */
export interface IWorkbookDetailQuery {
  /** 作业本别称 */
  alias: string;
  /** 学员id */
  studentId?: number;
}

/** 信息采集项 */
export interface InfoCollectItem {
  /** 资料项id */
  attributeId: number;
  /** 资料性创建时间 */
  createdAt?: string;
  /** 资料项展示名称 */
  attributeTitle?: string;
  /** 资料项唯一标识符key */
  attributeKey?: string;
  /** 用户资料项值，针对多选项，传递的是实际值，不是属性ID */
  value: string;
}
export interface IJoinWorkBookPayload {
  /** 作业本别称 */
  alias: string;
  /** 信息采集数据 */
  infoCollectItems?: InfoCollectItem[];
  /** 作业本所属的kdtId */
  targetKdtId: number;
}

export interface IGetWorkbookListQuery {
  studentId?: number;
  pageNumber: number;
  pageSize: number;
}

export interface IAjaxExtraOption {
  loading?: boolean;
  withErrorCode?: boolean;
}

export interface IAjaxResponse<T> {
  code: number;
  data?: T;
  msg: string;
}

/**
 * 学员端获取作业本详情
 *
 * http://zanapi.qima-inc.com/site/service/view/1004119
 */

// eslint-disable-next-line max-len
export function getWorkbookDetail(payload: IWorkbookDetailQuery, extraOptions?: IAjaxExtraOption): Promise<IUserExerciseDTO> {
  return ajax({
    method: 'GET',
    url: '/wscvis/supv/homework/getUserExercise.json',
    data: payload,
    ...(extraOptions || {}),
  });
}

/**
 * 加入作业本
 *
 * http://zanapi.qima-inc.com/site/service/view/1004121
 */

export function joinWorkbook(payload: IJoinWorkBookPayload): Promise<boolean> {
  return ajax({
    method: 'POST',
    url: '/wscvis/supv/homework/joinExerciseBook.json',
    data: payload,
  });
}

/**
 * 查询用户作业本列表
 */

export function getWorkbookList(payload: IGetWorkbookListQuery): Promise<IPage<IUserExercisePageDTO>> {
  return ajax({
    method: 'GET',
    url: '/wscvis/supv/homework/findUserExercisePage.json',
    data: payload,
    loading: false,
  });
}
