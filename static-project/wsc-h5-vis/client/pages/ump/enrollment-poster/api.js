import { ajax } from '@youzan/vis-ui';

export default {
  getById(id) {
    return ajax({
      url: '/wscvis/ump/enrollment-poster/get-by-id.json',
      data: { id },
    });
  },
};
