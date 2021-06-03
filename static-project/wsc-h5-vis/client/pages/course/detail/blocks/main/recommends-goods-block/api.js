import { ajax } from '@youzan/vis-ui';

export function recommend(targetAlias, relatedColumnAlias) {
  return ajax({
    url: '/wscvis/knowledge/goodsrecommend/recommend.json',
    data: {
      targetAlias,
      relatedColumnAlias,
      targetType: 2,
    },
    loading: false,
  });
}
