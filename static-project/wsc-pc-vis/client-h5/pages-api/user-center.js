import ajax from 'fns/ajax';

const userCenter = {
  GetTeacherInfoById(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getTeacherInfoById.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetShopInfoByKdtId(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getShopInfoByKdtId.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  PostUpdateTeacherAvatar(data) {
    return ajax({
      url: '/v4/vis/h5/edu/updateTeacherAvatar.json',
      method: 'POST',
      data,
    });
  },
};

export default userCenter;
