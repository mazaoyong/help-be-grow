import ajax from 'fns/ajax';

const apis = {
  deleteReview(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/feeds/deleteReview.json',
      method: 'POST',
      data,
    });
  },

  createLike(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/feeds/createLike.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  deleteLike(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/feeds/deleteLike.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  createComment(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/feeds/createComment.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  deleteComment(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/feeds/deleteComment.json',
      method: 'POST',
      data,
      loading: false,
    });
  },

  getTeacherInfo(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/getTeacherInfo.json',
      method: 'GET',
      data,
      loading: false,
    });
  },

  findComments(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/feeds/findComments.json',
      method: 'GET',
      data,
      loading: false,
    });
  },

  updateCover(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/updateCover.json',
      method: 'POST',
      data,
      loading: true,
    });
  },
};

export default apis;
