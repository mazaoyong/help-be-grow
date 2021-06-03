import ajax from 'fns/ajax';

const menu = {
  getPermission(data = {}) {
    return ajax({
      url: '/v4/vis/h5/edu/getPermission.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
};

export default menu;
