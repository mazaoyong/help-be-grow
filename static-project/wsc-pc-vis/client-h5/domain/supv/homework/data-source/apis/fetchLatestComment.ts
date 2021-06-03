import ajax from 'fns/ajax';
import { IReviewerCommentDTO } from 'definitions/api/owl/pc/ReviewerFacade/findLatestComment';
import { IPageRequestResult } from '../../commonTypes';
import { baseUrl } from './baseUrl';

export default function fetchAssignment(query?: any)
: Promise<IPageRequestResult<IReviewerCommentDTO>['data']> {
  return ajax({
    url: `${baseUrl}/supv/homework/findLatestComment.json`,
    method: 'GET',
    data: query,
    loading: false,
  });
}
