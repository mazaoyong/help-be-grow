import { ajax } from '@youzan/vis-ui';

// 线下课列表
export function findPageStuSchedule(data) {
  return ajax({
    url: '/wscvis/edu/findPageStuSchedule.json',
    data,
  });
}

// 线下课详情
export function findStuScheduleByCondition(data) {
  return ajax({
    url: '/wscvis/edu/findStuScheduleByCondition.json',
    data,
  });
}

// 上课记录
export function findPageLessonRecord(data) {
  return ajax({
    url: '/wscvis/edu/findPageLessonRecord.json',
    data,
  });
}

// 待上课列表
export function findWaitingLessonPage(data) {
  return ajax({
    url: '/wscvis/edu/findWaitingLessonPage.json',
    data,
  });
}

// 上课记录V2
export function findPageLessonRecordV2(data) {
  return ajax({
    url: '/wscvis/edu/findPageLessonRecordV2.json',
    data,
  });
}
