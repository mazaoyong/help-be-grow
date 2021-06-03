import { ajax } from '@youzan/vis-ui';

export default {
  // 线下课变更明细
  queryAssetOperationPage(data) {
    return ajax({
      url: '/wscvis/edu/queryAssetOperationPage.json',
      data,
    });
  },
};
