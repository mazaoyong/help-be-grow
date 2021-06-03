import ajax from 'fns/ajax';
import {
  IPageRequest,
  IHomeworkPageQuery,
  IHomeworkPageDTO,
} from 'definitions/api/owl/pc/HomeworkFacade/findPageByCondition';
import { IPageRequestResult } from '../../commonTypes';
import { baseUrl } from './baseUrl';

export default function fetchHomeworkList(
  pageRequest: IPageRequest,
  query?: IHomeworkPageQuery,
): Promise<IPageRequestResult<IHomeworkPageDTO>['data']> {
  return ajax({
    url: `${baseUrl}/supv/homework/findPageByCondition.json`,
    method: 'GET',
    data: {
      pageRequest,
      query,
    },
    loading: true,
  });
}
