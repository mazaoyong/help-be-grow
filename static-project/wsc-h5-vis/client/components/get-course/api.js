import { ajax } from '@youzan/vis-ui';

const { kdt_id: kdtId } = window._global;

export function getStudentList() {
  return ajax({
    url: '/wscvis/edu/getStudentList.json',
    method: 'GET',
    data: {
      kdtId,
    },
  });
}

export function getStudentDetail(data) {
  return ajax({
    url: '/wscvis/edu/getStudentDetail.json',
    method: 'GET',
    data: Object.assign(data, {
      kdtId,
      t: new Date().getTime(),
    }),
  });
}

export function getAddressList(data) {
  return ajax({
    url: '/wscvis/edu/getAddressList.json',
    method: 'GET',
    data: Object.assign(data, {
      kdtId,
    }),
  });
}
