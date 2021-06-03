import { ajax } from '@youzan/vis-ui';

export function getEvaluate(courseAlias) {
  return ajax({
    url: '/wscvis/edu/evaluation/lastEvaluation.json',
    data: {
      courseAlias,
    },
    loading: false,
  });
}
