import { ajax } from '@youzan/vis-ui';

// 学员列表
export function findByCustomerId(data) {
  return ajax({
    url: '/wscvis/edu/findByCustomerId.json',
    data,
  });
}

// 新建学员
export function createOwlStudent(data) {
  return ajax({
    url: '/wscvis/edu/createOwlStudent.json',
    type: 'POST',
    data,
  });
}

// 更新学员
export function updateOwlStudent(data) {
  return ajax({
    url: '/wscvis/edu/updateOwlStudent.json',
    type: 'PUT',
    data,
  });
}

// 查询单个学员
export function getSimpleById(data) {
  return ajax({
    url: '/wscvis/edu/getSimpleById.json',
    data,
  });
}

// 删除学员
export function deleteOwlStudent(data) {
  return ajax({
    url: '/wscvis/edu/deleteOwlStudent.json',
    type: 'DELETE',
    data,
  });
}
