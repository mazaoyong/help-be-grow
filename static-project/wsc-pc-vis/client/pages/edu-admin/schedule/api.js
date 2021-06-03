import { visAjax } from 'fns/new-ajax';

export { getClassroomById } from '../classroom/api';

// 获取老师列表
export function getTeacherListAPI(data) {
  return visAjax('GET', '/edu/schedule/teacherList.json', data);
}

// 查询老师列表（下拉分页接口）
export function findPage(data) {
  return visAjax('GET', '/edu-admin/teacher/findPage.json', data);
}

// 查询助教列表
export function findAssistantPage(data) {
  return visAjax('GET', '/edu-admin/teacher/findAssistantPage.json', data);
}

// 获取上课地
export function getStoreListAPI(data) {
  return visAjax('GET', '/edu/getStoreList.json', data);
}

// 获取教室列表
export function getClassroomsAPI(data) {
  return visAjax('GET', '/edu/classrooms.json', data);
}

// 获取班级列表
export function getEduClassListAPI(data) {
  return visAjax('GET', '/edu/course/findEduClassByCondition.json', data);
}

// 获取课节看板
export function getScheduleViewAPI(data) {
  return visAjax('GET', '/edu/schedule/view.json', data);
}

// 获取课节看板
export function getScheduleViewAPIV2(data) {
  return visAjax('GET', '/edu/schedule/viewV2.json', data);
}

// 获取课节看
export function getScheduleListAPI(data) {
  return visAjax('GET', '/edu/schedule/list.json', data);
}

// 获取课节看
export function getScheduleListAPIV2(data) {
  return visAjax('GET', '/edu/schedule/listV2.json', data);
}

// 删除课节
export function deleteLessonAPI(data) {
  return visAjax('DELETE', '/edu/schedule/lesson.json', data);
}

// 导出排课列表
export function exportSchedulesAPI(data) {
  return visAjax('POST', '/edu/schedule/export.json', data);
}

export function getActionResult(payload) {
  return visAjax('GET', '/edu/schedule/getActionResult.json', payload);
}

export function getDateRangeConfig() {
  return visAjax('GET', '/edu/schedule/getDateRangeConfig.json', {});
}

// 获取教室列表（带冲突检测）
export function getClassroomListWithConflict(payload) {
  return visAjax('POST', '/edu/schedule/getClassroom.json', payload);
}

// 获取门店列表
export function getStoreList(payload) {
  return visAjax('GET', '/edu/schedule/getClassStore.json', payload);
}

// 获取教师助教列表（带冲突检测）
export function getTeaOrAssWithConflict(payload) {
  return visAjax('POST', '/edu/schedule/getTeacherList.json', payload);
}

// 获取班级列表（带冲突检测）
export function getClassListWithConflict(payload) {
  return visAjax('GET', '/edu/schedule/getCourseClass.json', payload);
}

// 获取课程列表
export function getCourseList(payload) {
  return visAjax('GET', '/edu/schedule/getCourseList.json', payload);
}

// 提交前检测冲突
export function validateBeforeSaveOrModify(payload) {
  return visAjax('POST', '/edu/schedule/validateBeforeModify.json', payload);
}

// 创建日程
export function createSchedule(payload) {
  return visAjax('POST', '/edu/schedule/create.json', payload, { rawResponse: true });
}

// 获取日程
export function getScheduleDetail(payload) {
  return visAjax('GET', '/edu/schedule/getScheduleDetail.json', payload);
}

// 编辑日程
export function updateSchedule(payload) {
  return visAjax('POST', '/edu/schedule/update.json', payload, { rawResponse: true });
}

// 获取开始结束时间设置
export function getEduConfig() {
  return visAjax('GET', '/edu/getAppointmentConfig.json');
}

export function findResourceKanBanPage(payload) {
  return visAjax('GET', '/edu/schedule/findResourceKanBanPage.json', payload);
}

// 按周资源视图 V2 添加老师，助教列表查询
export function findResourceKanBanPageV2(payload) {
  return visAjax('GET', '/edu/schedule/findResourceKanBanPageV2.json', payload);
}

// 导出报表
export function exportRecord(params) {
  return visAjax('POST', '/edu/schedule/detail/exportScheduleRecords.json', params);
}

// 批量删除课节
export function batchDeleteLesson(params) {
  return visAjax('POST', '/edu-admin/schedule/batchDeleteLesson.json', params);
}
// 根据学员id获取学员课表
export function getCourseSchedule(data) {
  return visAjax('GET', '/edu/getCourseSchedule.json', data);
}
