import ajax from 'fns/ajax';

const apis = {
  getPostById(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/posterEdit/getPostById.json',
      method: 'GET',
      data,
    });
  },
  createReview(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/posterEdit/createReview.json',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data,
    });
  },
  updateReview(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/posterEdit/updateReview.json',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data,
    });
  },
  findLocationInfo(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/posterEdit/findLocationInfo.json',
      method: 'GET',
      data,
    });
  },
};

export default apis;
