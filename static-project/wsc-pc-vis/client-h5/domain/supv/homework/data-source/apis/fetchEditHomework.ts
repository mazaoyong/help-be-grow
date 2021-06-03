import ajax from 'fns/ajax';
import {
  IHomeworkDTO
} from 'definitions/api/owl/api/ReviewerExerciseFacade/getHomeworkDetail';
import { baseUrl } from './baseUrl';

export default function fetchEditHomework(
  data: { homeworkId: number },
 ): Promise<IHomeworkDTO> {
  return ajax({
    url: `${baseUrl}/supv/homework/getEditHomeworkDetail.json`,
    method: 'GET',
    data,
    loading: true,
  });
}
