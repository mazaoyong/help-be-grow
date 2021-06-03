import { ajax } from '@youzan/vis-ui';
const baseUrl = '/wscvis/edu';

export default {
  fetchGroupGoodsList(data) {
    return ajax({
      url: `${baseUrl}/findItemGroupPageForWym.json`,
      data,
    });
  },
};
