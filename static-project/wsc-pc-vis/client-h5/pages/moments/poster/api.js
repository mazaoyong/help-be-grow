import ajax from 'fns/ajax';

const apis = {
  findPostDetail(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/poster/findPostDetail.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
};

export default apis;
