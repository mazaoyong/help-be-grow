import ajax from 'fns/ajax';
import {
  IHomeworkCreateCommand,
} from 'definitions/api/owl/api/ReviewerExerciseFacade/createHomework';
import { baseUrl } from './baseUrl';

export default function createHomework(
  command: IHomeworkCreateCommand,
) {
  return ajax({
    url: `${baseUrl}/supv/homework/createHomework.json`,
    method: 'POST',
    data: {
      command,
    },
    loading: true,
  });
}
