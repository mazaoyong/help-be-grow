import { ajax } from '@youzan/vis-ui';

export default {
  // 根据pct alias 查询goodsid
  getByAlias(data) {
    return ajax({
      url: '/wscvis/product-common/getByAlias.json',
      data,
    });
  },

  // 查看团详情
  getGrouponDetail(data) {
    return ajax({
      url: '/wscvis/ump/groupon/getGroupOnDetail.json',
      data,
    });
  },

  // 获取用户参与某个活动的团
  getJoinedGroupsByUser(data) {
    return ajax({
      url: '/wscvis/ump/groupon/getJoinedGroupsByUser.json',
      data,
    });
  },

  // 获取参团用户列表
  getJoinFansInfoList(data) {
    return ajax({
      url: '/wscvis/ump/groupon/getJoinFansInfoList.json',
      data,
    });
  },

  // 获取拼团海报
  getGrouponPoster(data) {
    return ajax({
      url: '/wscvis/ump/groupon/getGrouponPoster.json',
      data,
    });
  },
};
