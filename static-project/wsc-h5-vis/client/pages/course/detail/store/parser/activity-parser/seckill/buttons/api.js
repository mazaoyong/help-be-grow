import { ajax } from '@youzan/vis-ui';

export function appointment(id) {
  return ajax({
    url: '/wscvis/seckill/appointment.json',
    method: 'post',
    data: {
      id,
    },
  });
}

export function getQuestion(id) {
  return ajax({
    url: '/v2/showcase/question/item.json',
    data: {
      question_id: id,
    },
  });
}
