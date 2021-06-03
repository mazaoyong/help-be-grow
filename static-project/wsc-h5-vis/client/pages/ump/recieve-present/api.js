import { ajax } from '@youzan/vis-ui';

// 领取赠品页列表
export function findPresentByCondition(data) {
  return ajax({
    url: '/wscvis/ump/findPresentByCondition.json',
    data,
  });
}

// 领取赠品页列表 -- 来源为活动赠品
export function listPresentsByCondition(data) {
  return ajax({
    url: '/wscvis/ump/present/list-presents-by-condition.json',
    data,
  });
}

// 领取赠品
export function receivePresent(data) {
  return ajax({
    url: '/wscvis/ump/present/receive-present.json',
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data,
    rawResponse: true,
  });
}
