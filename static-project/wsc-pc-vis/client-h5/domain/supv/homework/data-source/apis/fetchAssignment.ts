import ajax from 'fns/ajax';
import { IAssignmentDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import { baseUrl } from './baseUrl';

export default function fetchAssignment(assignmentId: number)
: Promise<IAssignmentDTO> {
  return ajax({
    url: `${baseUrl}/supv/homework/getAssignment.json`,
    method: 'GET',
    data: { assignmentId },
    loading: true,
  });
}
