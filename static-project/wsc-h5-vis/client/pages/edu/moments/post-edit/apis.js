import { ajax } from '@youzan/vis-ui';

const apis = {
  getPostById(data) {
    return ajax({
      url: '/wscvis/edu/moments/poster-edit/getPostById.json',
      method: 'GET',
      data,
    });
  },
  createReview(data) {
    return ajax({
      url: '/wscvis/edu/moments/poster-edit/createReview.json',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data,
    });
  },
  updateReview(data) {
    return ajax({
      url: '/wscvis/edu/moments/poster-edit/updateReview.json',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data,
    });
  },
  getCeresConfig(data) {
    return ajax({
      url: '/wscvis/edu/moments/poster-edit/getCeresConfig.json',
      method: 'get',
      data,
    });
  },
};

export default apis;
