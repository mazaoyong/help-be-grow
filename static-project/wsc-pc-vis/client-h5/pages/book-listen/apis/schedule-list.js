import ajax from 'fns/ajax';

// 获取上课地点列表
// http://zanapi.qima-inc.com/site/service/view/234756
export const getClassStore = ({ keyword }) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getClassStore.json',
    method: 'GET',
    data: {
      keyword,
    },
    loading: false,
  });
};

// todo，需要全部校区列表
// 获取上课校区列表
export const findPageAllCampus = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/findPageAllCampus.json',
    method: 'GET',
    data,
    loading: false,
  });
};

// 获取老师列表
// http://zanapi.qima-inc.com/site/service/view/527704
export const getTeacherList = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getTeacherList.json',
    method: 'GET',
    data,
    loading: false,
  });
};

// 获取教室列表
// http://zanapi.qima-inc.com/site/service/view/527706
export const getClassroom = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getClassroom.json',
    method: 'GET',
    data,
    loading: false,
  });
};

// 创建前校验
// http://zanapi.qima-inc.com/site/service/view/527707
export const validateBeforeModify = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/validateBeforeModify.json',
    method: 'POST',
    data,
    loading: true,
  });
};

// 创建日程排课
// http://zanapi.qima-inc.com/site/service/view/608567
export const create = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/create.json',
    method: 'POST',
    data,
    loading: true,
  });
};

// 轮询获取创建日程结果
export const getActionResult = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getActionResult.json',
    method: 'GET',
    data,
    loading: true,
  });
};

// 根据课程或课节名搜索课程
export const getCourseList = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getCourseList.json',
    methods: 'GET',
    data,
    loading: false,
  });
};

export const getScheduleList = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getLessons.json',
    method: 'GET',
    data,
    loading: true,
  });
};

export const getDays = (data) => {
  return ajax({
    url: '/v4/vis/h5/edu-admin/schedule/getDays.json',
    method: 'GET',
    data,
    loading: true,
  });
};
