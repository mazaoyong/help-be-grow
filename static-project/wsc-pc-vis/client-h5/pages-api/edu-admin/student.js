import ajax from 'fns/ajax';

export default {
  // 可添加的学员列表
  findStudentsPageForAddToSignInV2(data) {
    return ajax({
      url: '/v4/vis/h5/edu-admin/student/findStudentsPageForAddToSignInV2.json',
      method: 'GET',
      data,
      loading: false,
    });
  },

  // 添加学员到日程
  addStudentsV2(data) {
    return ajax({
      url: '/v4/vis/h5/edu-admin/student/addStudentsV2.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  // 查询学员冻结详情
  findLockedPage(data) {
    return ajax({
      url: '/v4/vis/h5/edu-admin/schedule/findLockedPage.json',
      data,
      loading: true,
    });
  },

  // 移除冻结日程
  batchCancel(data) {
    return ajax({
      url: '/v4/vis/h5/edu-admin/schedule/batchCancel.json',
      data,
      loading: true,
      type: 'post',
    });
  },

  // 日程下的学员列表
  findStudentsV3(data) {
    return ajax({
      url: '/v4/vis/h5/edu-admin/student/findStudentsV3.json',
      data,
    });
  },
}
;
