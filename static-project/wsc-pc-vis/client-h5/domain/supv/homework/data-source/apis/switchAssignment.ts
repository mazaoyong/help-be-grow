import ajax from 'fns/ajax';
import {
  IAssignmentSortQuery,
  IAssignmentSortDTO,
} from 'definitions/api/owl/pc/ReviewerFacade/assignmentSort';
import { baseUrl } from './baseUrl';

export default function switchAssignment(query: IAssignmentSortQuery)
: Promise<IAssignmentSortDTO> {
  return ajax({
    url: `${baseUrl}/supv/homework/assignmentSort.json`,
    method: 'GET',
    data: { query },
    loading: false,
  });
}
