/*
 * 转介绍海报(老学员)
 */

import { ajax } from '@youzan/vis-ui';

// 绘制海报
export function getIntroductionPoster(data) {
  return ajax({
    type: 'POST',
    url: '/wscvis/ump/poster/getIntroductionPoster.json',
    data,
    loading: false,
  });
}

// 图片检验
export function imageAppraise(data) {
  return ajax({
    url: '/wscvis/ump/introduction/imageAppraise.json',
    data,
  });
}
