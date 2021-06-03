/**
 * 模块所有接口定义文件
 * 注意:方法名字与url最后面方法名字保持一致
 */
import { visAjax } from 'fns/new-ajax';

// 获取数据模块基本信息
export function getTuitionOffsetBaseStats(payload) {
  return visAjax('GET', '/ump/tuition-offset/stats/getSimpleActivity.json', payload);
}

// 获取活动概况
export function getTuitionOffsetStatsById(payload) {
  return visAjax('GET', '/ump/tuition-offset/stats/getBrief.json', payload);
}

// 查看裂变效果排行
export function getTuitionOffsetEffectRankListByPage(payload) {
  return visAjax('GET', '/ump/tuition-offset/stats/getRankList.json', payload);
}

// 参与人明细查看
export function getTuitionOffsetParticipantByPage(payload) {
  return visAjax('GET', '/ump/tuition-offset/stats/getRewardList.json', payload);
}

// 导出裂变效果列表
export function exportRewardList(payload) {
  return visAjax('POST', '/ump/tuition-offset/stats/exportRewardList.json', payload);
}
