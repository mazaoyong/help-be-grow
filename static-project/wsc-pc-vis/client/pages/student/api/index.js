import { visAjax } from 'fns/new-ajax';

// 查询店铺下学员
export function getStudentListJson(data) {
  return visAjax('GET', '/edu/getStudentList.json', data);
}

// 根据学员id获取学员课程列表
export function getStudentCoursies(data) {
  return visAjax('GET', '/edu/student/findPageByQueryWithWrapCourse.json', data);
}
// 根据学员id获取学员课表
export function getCourseSchedule(data) {
  return visAjax('GET', '/edu/getCourseSchedule.json', data);
}

// 根据学员id获取学员学习记录
export function getCourseRecord(data) {
  return visAjax('GET', '/edu/getCourseRecord.json', data);
}

// 获取学员详情
export function getStudentDetail(data) {
  return visAjax('GET', '/edu/student.json', data);
}

// 获取课程列表
export function findCourseList(data) {
  return visAjax('GET', '/edu/student/course/list.json', data);
}

export function deleteStudentById(data) {
  return visAjax('PUT', '/edu/student/course/delete.json', data);
}
// 获取统计信息
export function getStatistic(data) {
  return visAjax('GET', '/edu/student/statistics.json', data);
}

// 学生调班
export function changeClass(data) {
  return visAjax('POST', '/edu/educlass/changeStudent.json', data);
}

// 修改有效期
export function modifyAvailableTime(data) {
  return visAjax('POST', '/edu/student/modifyAvailableTime.json', data);
}

// 查询店铺设置
export function getEduConfig() {
  return visAjax('GET', '/edu/settings.json');
}

// 查询连锁校区列表
export function getChainShopList(data) {
  return visAjax('Get', '/edu/chainShopList.json', data);
}

// 查询学员所属校区信息列表
export function getSchoolListOfStudent(data) {
  return visAjax('Get', '/edu/schoolListOfStudent.json', data);
}

// 修改课时检查
export function checkCourseTime(data) {
  return visAjax('GET', '/edu/student/checkCourseTime.json', data);
}

// 修改课时
export function updateCourseTime(data) {
  return visAjax('POST', '/edu/student/updateCourseTime.json', data);
}

export function getRemoteConf() {
  return visAjax('GET', '/edu/profile/get-remote-conf.json', {});
}

/**
 * 查询校区（分店）列表——不分页
 */

export function findListAllCampus(payload) {
  return visAjax('GET', '/commom/shop/findListAllCampus.json', payload);
}

// 查询店铺下学员v2
export function findPageByQueryV2(data) {
  return visAjax('GET', '/edu/student/findPageByQueryV2.json', data);
}

// 获取报读列表
export function findSignUpReadInfo(data) {
  return visAjax('GET', '/edu/student/findSignUpReadInfo.json', data);
}
