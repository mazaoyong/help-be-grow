import { ajax } from '@youzan/vis-ui';

export function getQuestion(id) {
  return ajax({
    url: '/v2/showcase/question/item.json',
    data: {
      question_id: id,
    },
  });
}
