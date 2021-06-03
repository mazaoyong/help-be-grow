import { ajax } from '@youzan/vis-ui';

export default {
  // 包含分销员海报的简版商品信息查询接口
  getDistributorDetail(data) {
    return ajax({
      url: '/wscvis/ump/invite-card/getDistributorDetail.json',
      data,
    });
  },
};
