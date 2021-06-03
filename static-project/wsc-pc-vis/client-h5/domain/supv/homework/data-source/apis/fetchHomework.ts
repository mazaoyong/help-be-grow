import ajax from 'fns/ajax';
import {
  IHomeworkDTO
} from 'definitions/api/owl/api/ReviewerExerciseFacade/getHomeworkDetail';
import { baseUrl } from './baseUrl';

export default function fetchHomework(
  data: { homeworkId: number },
 ): Promise<IHomeworkDTO> {
  return ajax({
    url: `${baseUrl}/supv/homework/getHomeworkDetail.json`,
    method: 'GET',
    data,
    loading: true,
  });
}
