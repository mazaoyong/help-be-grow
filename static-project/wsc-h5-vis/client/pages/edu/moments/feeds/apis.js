import { ajax } from '@youzan/vis-ui';

const apis = {
  deleteReview(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/deleteReview.json',
      method: 'POST',
      data,
    });
  },

  createLike(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/createLike.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  deleteLike(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/deleteLike.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  createComment(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/createComment.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  deleteComment(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/deleteComment.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  findComments(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/findComments.json',
      method: 'GET',
      data,
      loading: false,
    });
  },

  getUserInfo(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/getUserInfo.json',
      method: 'GET',
      data,
      loading: false,
    });
  },

  getTeacherInfo(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/getTeacherInfo.json',
      method: 'GET',
      data,
      loading: false,
    });
  },

  updateCover(data) {
    return ajax({
      url: '/wscvis/edu/moments/updateCover.json',
      method: 'POST',
      data,
      loading: true,
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
