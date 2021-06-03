import ajax from 'fns/ajax';
import {
  IAssignmentPageDTO,
  IHomeworkAssignmentQuery,
  IPageRequest,
} from 'definitions/api/owl/pc/AssignmentFacade/findHomeworkAssignmentPage';
import { IPageRequestResult } from '../../commonTypes';
import { baseUrl } from './baseUrl';

export default function fetchAssignmentList(
  data: {
    pageRequest: IPageRequest,
    query: IHomeworkAssignmentQuery,
  },
 ): Promise<IPageRequestResult<IAssignmentPageDTO>['data']> {
  return ajax({
    url: `${baseUrl}/supv/homework/findHomeworkAssignmentPage.json`,
    method: 'GET',
    data,
    loading: false,
  });
}
