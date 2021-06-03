import { visAjax } from 'fns/new-ajax';
import request from './request';
// 班级列表
export const getClassList = data => {
  return request('GET', '/classes.json', data);
};

// 新建班级
export const createClass = data => {
  return request('POST', '/class.json', data);
};

// 修改班级
export const updateClass = data => {
  return request('PUT', '/class.json', data);
};

// 删除班级
export const deleteClass = data => {
  return request('DELETE', '/class.json', data);
};

// 查询班级
export const getClass = data => {
  return request('GET', '/class.json', data);
};

// 查询班级 详细版本
export const getClassDetail = data => {
  return request('GET', '/classDetail.json', data);
};

// 通过No查询班级
export const getClassDetailByNo = data => {
  return request('GET', '/classDetailByNo.json', data);
};

// 添加学员到某个班级
export const addStudent = data => {
  return request('POST', '/addStudent.json', data);
};

// 将学员从一个班调到另外一个班
export const changeStudent = data => {
  return request('POST', '/changeStudent.json', data);
};

// 获取课程列表
export const getCourseList = data => {
  return request('GET', '/courseList.json', data);
};

// 学员列表
export const getStudentList = data => {
  return request('GET', '/studentsInClass.json', data);
};

// 学员弹窗列表
export const getStudentListDialog = data => {
  return request('GET', '/students.json', data);
};

// 上课记录
export const getRecordList = data => {
  return request('GET', '/records.json', data);
};

// 移除班级下学员
export const removeClassStu = data => {
  return request('DELETE', '/removeClassStu.json', data);
};

export function getRemoteConf(data) {
  return visAjax('GET', '/edu/profile/get-remote-conf.json', data);
}
