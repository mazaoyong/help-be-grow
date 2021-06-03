// 这个文件，所有暴露出的API所调用的代码，包括对应的node路由也都没有用了，请择期清理 TOCLEAR

import request from '../../api/request';

// 查询预约列表
export const getReserveList = data => {
  return request('POST', '/list.json', data); // post的方式是因为get都是字符串，后端不能转
};

// 导出预约列表数据
export const exportData = data => {
  return request('POST', '/exportData.json', data); // post的方式是因为get都是字符串，后端不能转
};

// 查询不同预约状态的数量
export const getCountStatus = data => {
  return request('POST', '/countStatus.json', data); // post的方式是因为get都是字符串，后端不能转
};

// 查询预约看板数据
export const getCourseScheduleKanban = data => {
  return request('POST', '/courseScheduleKanban.json', data); // post的方式是因为get都是字符串，后端不能转
};

// 新建预约
export const createReserve = data => {
  return request('POST', '/reserve.json', data);
};

// 修改预约
export const updateReserve = data => {
  return request('PUT', '/reserve.json', data);
};

// 手机号联想
export const searchCustomerByPhoneNum = data => {
  return request('GET', '/searchCustomerByPhoneNum.json', data);
};

// 查询课程列表
export const getCourseList = data => {
  return request('GET', '/courseList.json', data);
};

// 查询课程详情
export const getCoursePCDetail = data => {
  return request('GET', '/coursePCDetail.json', data);
};

// 查询学员列表
export const getCustomerStudentList = data => {
  return request('GET', '/customerStudentList.json', data);
};

// 新建学员
export const createCustomerStudent = data => {
  return request('POST', '/createStudent.json', data);
};

// 新建客户
export const createCustomer = data => {
  return request('POST', '/createCustomer.json', data);
};

// 查询老师列表
export const getTeacherList = data => {
  return request('GET', '/getTeacherList.json', data);
};

// 查询上课地点
export const getStoreList = data => {
  return request('GET', '/getStoreList.json', data);
};
