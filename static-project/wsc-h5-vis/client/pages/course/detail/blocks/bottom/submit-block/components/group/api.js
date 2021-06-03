import { ajax } from '@youzan/vis-ui';

export function getGroupOnDetail(activityType, groupAlias) {
  return ajax({
    url: '/wscvis/ump/groupon/getGroupOnDetail.json',
    data: {
      activity_type: activityType,
      group_alias: groupAlias,
    },
    loading: false,
  });
}
