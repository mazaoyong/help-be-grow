import ajax from 'fns/ajax';
import {
  IReviewCommand,
} from 'definitions/api/owl/api/ReviewerExerciseFacade/review';
import { baseUrl } from './baseUrl';

export default function review(
  command: IReviewCommand,
) {
  return ajax({
    url: `${baseUrl}/supv/homework/review.json`,
    method: 'POST',
    data: {
      command,
    },
    loading: command.type === 1,
  });
}
