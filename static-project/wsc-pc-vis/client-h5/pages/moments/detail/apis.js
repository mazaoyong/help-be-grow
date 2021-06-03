import ajax from 'fns/ajax';

const apis = {
  deleteReview(data) {
    return ajax({
      url: '/v4/vis/h5/edu/moments/feeds/deleteReview.json',
      method: 'POST',
      data,
    });
  },
};

export default apis;
