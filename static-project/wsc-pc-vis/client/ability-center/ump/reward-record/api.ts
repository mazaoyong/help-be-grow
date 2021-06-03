import { visAjax } from 'fns/new-ajax';
import { IPage } from 'definitions/api/owl/pc/common';
import {
  IRewardRecordLogDTO,
  IRewardRecordQueryParams,
} from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';

export function findRewardDetail(data: IRewardRecordQueryParams) {
  return visAjax<IPage<IRewardRecordLogDTO>>(
    'GET',
    '/ump/common/getRewardByPage.json',
    data,
  );
}
