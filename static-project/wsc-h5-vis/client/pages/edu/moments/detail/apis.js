import { ajax } from '@youzan/vis-ui';

const apis = {
  deleteReview(data) {
    return ajax({
      url: '/wscvis/edu/moments/feeds/deleteReview.json',
      method: 'POST',
      data,
    });
  },
};

export default apis;
