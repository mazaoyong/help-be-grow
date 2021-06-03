/**
 * 转介绍
 */

import { ajax } from '@youzan/vis-ui';

// 被介绍人（新学员）的活动页面信息
export function getRefereeActivityDetail(data) {
  return ajax({
    url: '/wscvis/ump/introduction/getRefereeActivityDetail.json',
    data,
  });
}

// 获取店铺中进行中的活动
export function getIntroductionActivity(data) {
  return ajax({
    url: '/wscvis/ump/introduction/getIntroductionActivity.json',
    data,
  });
}

// 活动鉴权
export function checkActivityThreshold(data) {
  return ajax({
    url: '/wscvis/ump/introduction/checkActivityThreshold.json',
    data,
  });
}
