/**
 * 转介绍
 */
import { ajax } from '@youzan/vis-ui';

// 分页查询邀请记录
export function findIntroduceRecord(data) {
  return ajax({
    url: '/wscvis/ump/introduction/findIntroduceRecord.json',
    data,
    loading: false,
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

export function getOldStudentSummary(data) {
  return ajax({
    url: '/wscvis/ump/introduction/getOldStudentSummary.json',
    data,
  });
}

export function getRewardByPage(data) {
  return ajax({
    url: '/wscvis/ump/common/getRewardByPage.json',
    data,
  });
}

export function refererShareActivity(data) {
  return ajax({
    url: '/wscvis/ump/introduction/refererShareActivity.json',
    data,
  });
}
