import request from './request';
import { visAjax } from 'fns/new-ajax';

// 预约列表
export const getAppointmentList = data => {
  return request('GET', '/appointmentList.json', data);
};
// 导出预约
export const exportAppointment = data => {
  return request('post', '/export.json', data);
};

// 预约看板
export const getAppointmentKanban = data => {
  if (data.filter && !data.filter.kdtId) {
    data.filter.kdtId = _global.kdtId;
  }
  return request('GET', '/appointmentKanban.json', data);
};

// 新建预约
export const createAppointment = data => {
  return request('POST', '/appointment.json', data);
};

// 确认预约
export const confirmAppointment = data => {
  return request('PUT', '/appointment.json', data);
};

// 修改预约
export const updateStudentLesson = data => {
  return visAjax('POST', '/edu-admin/appointment/updateStudentLesson.json', data);
};

// 新建试听预约
export const createAuditionAppointment = data => {
  return request('POST', '/auditionAppointment.json', data);
};

// 删除预约
export const cancelAppointment = data => {
  return request('DELETE', '/appointment.json', data);
};

// 获取预约信息
export const getAppointment = data => {
  return request('GET', '/appointment.json', data);
};

// 获取修改时预约信息
export const getStudentLessonForUpdate = data => {
  return visAjax('GET', '/edu-admin/appointment/getStudentLessonForUpdate.json', data);
};

// 获取地址列表
export const getStoreList = data => {
  return request('GET', '/storeList.json', data);
};

// 课节列表
export const getLessons = data => {
  return request('GET', '/lessons.json', data);
};

// 获取课节分页列表
export const getLessonsByPage = data => {
  return visAjax('GET', '/edu-admin/appointment/lessonsByPage.json', data);
};

// 可用的时间列表
export const getdayList = data => {
  return request('GET', '/days.json', data);
};

// 可用的地址列表
export const getAddressList = data => {
  return request('GET', '/address.json', data);
};

// 学员列表
export const getStudentList = data => {
  return request('GET', '/students.json', data);
};

// 获取课程列表
export const getCourseList = data => {
  return visAjax('GET', '/edu/eduClass/courseList.json', data);
};

// 线下课列表 不分页
export const getOfflineCourseList = data => {
  return request('GET', '/courses.json', data);
};

// 获取开始结束时间设置
export function getEduConfig() {
  return visAjax('GET', '/edu/settings.json');
}

export const detectConflict = data => {
  return visAjax('GET', '/edu/appointment/conflict.json', data);
};

export const getUpdateAppointmentResult = data => {
  return visAjax('GET', '/edu-admin/appointment/getUpdateAppointmentResult.json', data);
};
