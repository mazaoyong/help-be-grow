import ajax from 'fns/ajax';

export const findLittlePage = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/findLittlePage.json',
    data,
    loading: true,
  });
};

// 查询学员冻结详情
export const findLockedPage = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/findLockedPage.json',
    data,
    loading: true,
  });
};

// 移除冻结日程
export const batchCancel = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/batchCancel.json',
    data,
    loading: true,
    type: 'post',
  });
};

// 查询签到、请假等提示，第一次 批量
export const getBatchSignInTip = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getBatchSignInTip.json',
    data,
    loading: true,
  });
};

// 查询签到、请假等提示，第一次 单个
export const getSignInTip = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getSignInTip.json',
    data,
    loading: true,
  });
};

// 发起 签到、请假、未到
export const businessBatchSignInV2 = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/businessBatchSignInV2.json',
    type: 'post',
    contentType: 'application/json',
    data,
    loading: true,
  });
};

// 请假、未到轮询单个
export const getSignInResult = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getSignInResult.json',
    data,
    loading: false,
  });
};

// 请假、未到轮询批量
export const getBatchSignInResult = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getBatchSignInResult.json',
    data,
    loading: false,
  });
};
