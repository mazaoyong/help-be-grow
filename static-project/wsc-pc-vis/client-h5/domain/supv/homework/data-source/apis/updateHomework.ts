import ajax from 'fns/ajax';
import {
  IHomeworkCreateCommand,
} from 'definitions/api/owl/api/ReviewerExerciseFacade/updateHomework';
import { baseUrl } from './baseUrl';

export default function updateHomework(
  command: IHomeworkCreateCommand,
) {
  return ajax({
    url: `${baseUrl}/supv/homework/updateHomework.json`,
    method: 'POST',
    data: {
      command,
    },
    loading: true,
  });
}
