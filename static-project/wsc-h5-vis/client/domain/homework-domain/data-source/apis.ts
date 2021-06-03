import { ajax } from '@youzan/vis-ui';
import { IUserHomeworkDTO } from 'definitions/api/owl/api/UserExerciseFacade/getHomeworkDetail';
/** 学员端获取作业列表接口 */
export interface IHomeworkQuery {
  /** 作业别称 */
  alias: string;
}

export interface IAjaxExtraOption {
  loading?: boolean;
  withErrorCode?: boolean;
}

/**
 * 学员端查询作业详情
 *
 * http://zanapi.qima-inc.com/site/service/view/1008488
 */

export function getHomeworkDetail(payload: IHomeworkQuery, extraOptions?: IAjaxExtraOption): Promise<IUserHomeworkDTO> {
  return ajax({
    method: 'GET',
    url: '/wscvis/supv/homework/getHomeworkDetail.json',
    data: payload,
    ...(extraOptions || {}),
  });
}
