import ajax from 'fns/ajax';
import {
  IAssignmentSortDTO,
  IAssignmentSortQuery,
} from 'definitions/api/owl/pc/ReviewerFacade/assignmentSort';
import { baseUrl } from './baseUrl';

export default function fetchAssignment(query: IAssignmentSortQuery)
: Promise<IAssignmentSortDTO> {
  return ajax({
    url: `${baseUrl}/supv/homework/assignmentSort.json`,
    method: 'GET',
    data: { query },
    loading: false,
  });
}
