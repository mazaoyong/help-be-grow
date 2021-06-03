import { ajax } from '@youzan/vis-ui';

const apis = {
  findPostDetail(data) {
    return ajax({
      url: '/wscvis/edu/moments/findPostDetail.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  getWechatCode(data) {
    return ajax({
      url: '/wscvis/edu/moments/getWechatCode.json',
      method: 'GET',
      data,
    });
  },
};

export default apis;
