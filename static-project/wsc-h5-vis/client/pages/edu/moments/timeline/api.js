import { ajax } from '@youzan/vis-ui';

const apis = {
  findPostsForUser(data) {
    return ajax({
      url: '/wscvis/edu/moments/findPostsForUser.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
};

export default apis;
