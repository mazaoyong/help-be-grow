import {
  getWorkbookDetail as getWorkbookDetailApi,
  IWorkbookDetailQuery,
  IJoinWorkBookPayload,
  joinWorkbook as joinWorkbookApi,
  IGetWorkbookListQuery,
  getWorkbookList as getWorkbookListApi,
  IAjaxExtraOption,
} from '../data-source/apis';
import { WorkbookDetailEntity } from '../entities/workbookDetailEntity';
import { WorkbookListEntity } from '../entities/workbookListEntity';
import Workbook from '../entities/workbook';

/**
 * 学员端获取作业本详情接口
 *
 */

export function getWorkbookDetail(
  payload: IWorkbookDetailQuery,
  extraOptions?: IAjaxExtraOption,
) {
  return getWorkbookDetailApi(payload, extraOptions).then(res => {
    return new WorkbookDetailEntity(res);
  });
};

/**
 * 获取用户所属的作业本信息
 */

export function getWorkbookList(payload: IGetWorkbookListQuery) {
  return getWorkbookListApi(payload).then(workbookPage => {
    return new WorkbookListEntity(workbookPage);
  });
}

export function joinWorkbook(payload: IJoinWorkBookPayload) {
  return joinWorkbookApi(payload);
  // return Promise.resolve(true);
};

export default {
  /**
   * 学员端获取作业本详情接口
   *
   */

  getWorkbookDetail(
    payload: IWorkbookDetailQuery,
    extraOptions?: IAjaxExtraOption,
  ) {
    return getWorkbookDetailApi(payload, extraOptions).then(res => {
      return new Workbook(res);
    });
  },

  /**
   * 加入作业本
   *
   */

  joinWorkbook(payload: IJoinWorkBookPayload) {
    return joinWorkbookApi(payload);
    // return Promise.resolve(true);
  },

  /**
   * 获取用户所属的作业本信息
   */

  getWorkbookList(payload: IGetWorkbookListQuery) {
    return getWorkbookListApi(payload).then(workbookPage => {
      return {
        content: workbookPage.content.map(workbook => new Workbook(workbook)),
        total: workbookPage.total,
        pageable: workbookPage.pageable,
      };
    });
  },
};
