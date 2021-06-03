import { visAjax } from 'fns/new-ajax';

const prefix = '/edu/educlass';

function request(method, url, data, options?: object) {
  return visAjax(method, prefix + url, data, options);
}

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

// 获取课程列表
export const getCourseList = data => {
  return request('GET', '/courseList.json', data);
};
