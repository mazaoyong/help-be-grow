import { visAjax } from 'fns/new-ajax';

// 获取优惠券列表数据
export function getCouponListAPI() {
  /* return ironAjax('GET', '/apps/common/couponlist.json', {
    source: 'meetReduce',
  }); */
  return visAjax('GET', '/pct/common/findAllValidCouponListByKdtId.json',
    {
      source: 'meetReduce',
    }
  );
}

// 失效活动
export function failureActivity(data) {
  return visAjax('POST', `/pct/exam/failureActivity.json`, data);
}

// 删除活动
export function deleteActive(data) {
  return visAjax('POST', `/pct/exam/deleteActivity.json`, data);
}

// 列表
export function getLists(data) {
  return visAjax('GET', '/pct/exam/getList.json', data);
}

// 获取基础信息
export function getBasis(data) {
  return visAjax('GET', '/pct/exam/getBasisList.json', data);
}

// 保存基础信息
export function saveBasis(data) {
  return visAjax('POST', '/pct/exam/postSaveBasis.json', data);
}

// 获取题目信息
export function getTitle(data) {
  return visAjax('GET', '/pct/exam/getTitleLists.json', data);
}

// 保存题目信息
export function saveTitle(data) {
  return visAjax('POST', '/pct/exam/postSaveTitle.json', data);
}

// 更新题目信息
export function updateTitle(data) {
  return visAjax('POST', '/pct/exam/postUpdateQuestionList.json', data);
}

// 获取结果列表
export function getResult(data) {
  return visAjax('GET', '/pct/exam/getResultList.json', data);
}

// 保存结果信息
export function saveResult(data) {
  return visAjax('POST', '/pct/exam/postSaveResult.json', data);
}

// 更新结果信息
export function updateResult(data) {
  return visAjax('POST', '/pct/exam/postUpdateResultList.json', data);
}

// 获取完成页信息
export function getFinish(data) {
  return visAjax('GET', '/pct/exam/getFinish.json', data);
}

// 保存完成页信息
export function saveFinish(data) {
  return visAjax('POST', '/pct/exam/postSaveFinish.json', data);
}

// 推广码之获取公众号
export function getExamMpQrCode(data) {
  return visAjax('GET', '/pct/exam/getExamMpQrCode.json', data);
}

// 复制小测试
export function copyExam(data) {
  return visAjax('POST', '/pct/exam/copy.json', data);
}

// 是否展示百度小程序
export function showBdappCode(data) {
  return visAjax('GET', '/channel/getMpVersion.json', data);
}

// 是否展示百度小程序
export function getBdappCode(data) {
  return visAjax('GET', '/channel/getBaiduAppCode.json', data);
}

// 分页查询测验参与用户列表
export function getParticipantList(data) {
  return visAjax('GET', '/ump/exam/findPage.json', data);
}

// 查询用户测验的成绩单
export function getExamResult(data) {
  return visAjax('GET', '/ump/exam/getTranscript.json', data);
}

// 查询用户测验的答题详情
export function getUserAnswerDetail(data) {
  return visAjax('GET', '/ump/exam/getUserAnswerDetail.json', data);
}

// 分页查询店铺客户信息
export function getCustomerList(data) {
  return visAjax('GET', '/ump/exam/getCustomerList.json', data);
}

// 查询测验是否有用户参与
export function examHasParticipant(data) {
  return visAjax('GET', '/ump/exam/examExistUser.json', data);
}
