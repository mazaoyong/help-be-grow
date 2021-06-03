import ajax from 'fns/ajax';

const login = {
  Logout(data) {
    return ajax({
      url: '/v4/vis/h5/edu/logout.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
};

export default login;
