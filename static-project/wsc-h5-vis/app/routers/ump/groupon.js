module.exports = [
  [
    // 拼团详情页
    'GET',
    ['/wscvis/ump/groupon/groupon-detail', '/wscvis/edu/groupon-detail'],
    'ump.GrouponController',
    'renderGrouponDetailHtml',
  ],
  [
    // 获取拼团详情
    'GET',
    '/wscvis/ump/groupon/getGroupOnDetail.json',
    'ump.GrouponController',
    'getGroupOnDetail',
  ],
  [
    // 获取用户参与某个活动的团
    'GET',
    '/wscvis/ump/groupon/getJoinedGroupsByUser.json',
    'ump.GrouponController',
    'getJoinedGroupsByUser',
  ],
  [
    // 获取参团用户列表
    'GET',
    '/wscvis/ump/groupon/getJoinFansInfoList.json',
    'ump.GrouponController',
    'getJoinFansInfoList',
  ],
  [
    // 获取拼图你海报
    'GET',
    '/wscvis/ump/groupon/getGrouponPoster.json',
    'ump.PosterController',
    'getGrouponPoster',
  ],
];
