// 公众号海报相关接口
import request from 'fns/pct-ajax';
import { visAjax } from 'fns/new-ajax';

// 打卡列表
export function getPunchListAPI(data) {
  return request('GET', '/punch/list.json', data);
}

// 创建打卡活动
export function createPunchActiveAPI(data) {
  return request('POST', '/punch/active.json', data);
}

// 删除打卡活动
export function deletePunchActiveAPI(data) {
  return request('DELETE', '/punch/active.json', data);
}

// 更新打卡活动
export function updatePunchActiveAPI(data) {
  return request('PUT', '/punch/active.json', data);
}

// 查询打卡详情
export function getPunchActiveAPI(gciAlias) {
  return request('GET', '/punch/active.json', { gciAlias });
}

// 获取群打卡简要信息
export function getPunchBriefAPI(gciAlias) {
  return request('GET', '/punch/brief.json', { gciAlias });
}

// 上下架群打卡
export function updatePunchStatusAPI(data) {
  return request('PUT', '/punch/status.json', data);
}

// 获取群打卡统计信息
export function getPunchStatisticsAPI(gciAlias) {
  return request('GET', '/punch/statistics.json', { gciAlias });
}

// 打卡任务列表
export function getPunchTaskListAPI(data) {
  return request('GET', '/punch/task/list.json', data);
}

// 打卡任务详情
export function getPunchTaskAPI(taskId) {
  return request('GET', '/punch/task.json', { taskId });
}

// 更新打卡任务
export function updatePunchTaskAPI(data) {
  return request('PUT', '/punch/task.json', data);
}

// 获取群打卡推广配置
export function getPunchPromotionAPI(gciAlias) {
  return request('GET', '/punch/promotion.json', { gciAlias });
}

// 获取群打卡推广配置
export function updatePunchPromotionAPI(data) {
  return request('PUT', '/punch/promotion.json', data);
}

// 查询打卡日记列表
export function getPunchLogsListAPI(data) {
  return request('GET', '/punch/log.json', data);
}

export function getPunchtTeacherLogsAPI(data) {
  return request('GET', '/punch/teacherLog.json', data);
}

// 打卡日记精选状态
export function updateSelectionStatusAPI(data) {
  return request('PUT', '/punch/diary/selection.json', data);
}

// 打卡日记显示/隐藏
export function updateShowStatusAPI(data) {
  return request('PUT', '/punch/diary/show.json', data);
}

// 添加老师评论
export function addPunchLogsAPI(data) {
  return request('POST', '/punch/log.json', data);
}

// 删除评论
export function deletePunchLogsAPI(data) {
  return request('DELETE', '/punch/log.json', data);
}

// 获取学员数据
export function getPunchStudentDataAPI(data) {
  return request('GET', '/punch/student.json', data);
}

// 获取每日数据
export function getPunchDailyDataAPI(data) {
  return request('GET', '/punch/daily.json', data);
}

// 获取打卡专栏
export function getPunchColumnsAPI(data) {
  return request('GET', '/punch/columns.json', data);
}

// 导出打卡数据
export function exportData(data) {
  return request('GET', '/punch/export', data);
}

// 优惠券列表
export function getCouponListAPI(data) {
  return request('GET', '/retail/coupon.json', data);
}

export function getColumnBaseJson(alias) {
  // 根据别名查询专栏基本信息
  return visAjax('GET', '/course/column/base.json', { alias });
}
