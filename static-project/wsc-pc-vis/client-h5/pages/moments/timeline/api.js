import ajax from 'fns/ajax';

const apis = {
  findPostsForStaff(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/timeline/findPostsForStaff.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
};

export default apis;
