module.exports = [
  [
    // 老直播单页
    'GET',
    ['/v4/vis/pct/page/live', '/v4/vis/course/live'],
    'course.live.LiveController',
    'redirectToNewUrl',
  ],
  [
    // 新直播单页
    'GET',
    ['/v4/vis/course/live/list'],
    'course.live.LiveController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 新直播编辑页
    'GET',
    ['/v4/vis/course/live/add', '/v4/vis/course/live/edit/:alias'],
    'course.live.LiveController',
    ['initVisPage', 'getEditHtml'],
  ],
  [
    // 新直播保利威页面
    'GET',
    ['/v4/vis/course/live/polyv'],
    'course.live.LiveController',
    ['initVisPage', 'getPolyvHtml'],
  ],
  [
    'POST',
    [
      '/v4/vis/course/live/createLive.json',
      '/v4/vis/course/live/_textarea_/createLive.json',
      '/v4/vis/pct/live/createLive.json',
    ],
    'course.live.LiveController',
    'createLive',
  ],
  [
    'POST',
    [
      '/v4/vis/course/live/updateLive.json',
      '/v4/vis/course/live/_textarea_/updateLive.json',
      '/v4/vis/pct/live/updateLive.json',
    ],
    'course.live.LiveController',
    'updateLive',
  ],
  [
    'GET',
    ['/v4/vis/course/live/getByAlias.json', '/v4/vis/pct/live/getByAlias.json'],
    'course.live.LiveController',
    'getByAlias',
  ],
  [
    'GET',
    ['/v4/vis/course/live/findPageByCondition.json', '/v4/vis/pct/live/findPageByCondition.json'],
    'course.live.LiveController',
    'findPageByCondition',
  ],
  // 获取wym编辑用直播列表
  [
    'GET',
    '/v4/vis/course/live/findPageByConditionWym.json',
    'course.live.LiveController',
    'findPageByConditionWym',
  ],
  [
    'POST',
    ['/v4/vis/course/live/deleteLive.json', '/v4/vis/pct/live/deleteLive.json'],
    'course.live.LiveController',
    'deleteLive',
  ],
  [
    'POST',
    ['/v4/vis/course/live/updateSerialNo.json', '/v4/vis/pct/live/updateSerialNo.json'],
    'course.live.LiveController',
    'updateSerialNo',
  ],
  [
    'POST',
    [
      '/v4/vis/course/live/updateShowOrHideStatus.json',
      '/v4/vis/pct/live/updateShowOrHideStatus.json',
    ],
    'course.live.LiveController',
    'updateShowOrHideStatus',
  ],
  [
    'POST',
    ['/v4/vis/course/live/updateFreeLive.json', '/v4/vis/pct/live/updateFreeLive.json'],
    'course.live.LiveController',
    'updateFreeLive',
  ],
  [
    'POST',
    ['/v4/vis/course/live/updateCloseLive.json', '/v4/vis/pct/live/updateCloseLive.json'],
    'course.live.LiveController',
    'updateCloseLive',
  ],
  [
    'GET',
    [
      '/v4/vis/course/live/getLiveInviteAdminCode.json',
      '/v4/vis/pct/live/getLiveInviteAdminCode.json',
    ],
    'course.live.LiveController',
    'getLiveInviteAdminCode',
  ],
  [
    // 快速更新名称，价格
    'POST',
    [
      '/v4/vis/course/live/quickUpdateLiveByAlias.json',
      '/v4/vis/pct/live/quickUpdateLiveByAlias.json',
    ],
    'course.live.LiveController',
    'quickUpdateLiveByAlias',
  ],
  [
    'GET',
    ['/v4/vis/course/live/subscriptionCount.json', '/v4/vis/pct/live/subscriptionCount.json'],
    'course.live.LiveController',
    'getLiveSubscriptionCount',
  ],
  // 保存商家保利威授权信息
  [
    'POST',
    '/v4/vis/course/live/polyv/savePolvyAuth.json',
    'course.live.PolyvController',
    'savePolyvAuth',
  ],
  // 获取商家保利威授权信息
  [
    'GET',
    '/v4/vis/course/live/polyv/getPolvyAuth.json',
    'course.live.PolyvController',
    'getPolyvAuth',
  ],
  // 创建保利威直播前的鉴权&数量校验
  ['GET', '/v4/vis/course/live/polyv/polyvCheck.json', 'course.live.PolyvController', 'polyvCheck'],
  // 进入直播间信息查询
  [
    'GET',
    '/v4/vis/course/live/polyv/getLiveEnterInfo.json',
    'course.live.PolyvController',
    'getLiveEnterInfo',
  ],
  // 获取保利威直播管理页面链接
  [
    'GET',
    '/v4/vis/course/live/polyv/getPolyvBackLink.json',
    'course.live.PolyvController',
    'getPolyvBackLink',
  ],
  // 获取保利威直播频道列表
  [
    'GET',
    '/v4/vis/course/live/polyv/findPoliyvLives.json',
    'course.live.PolyvController',
    'findPoliyvLives',
  ],
  // 异步新建保利威直播频道
  [
    'POST',
    '/v4/vis/course/live/polyv/asyncCreatePolyvLive.json',
    'course.live.PolyvController',
    'asyncCreatePolyvLive',
  ],
  // 查询保利威直播频道新建结果
  [
    'GET',
    '/v4/vis/course/live/polyv/getAsyncCreateStatus.json',
    'course.live.PolyvController',
    'getAsyncCreateStatus',
  ],
  // 异步创建直播频道
  [
    'POST',
    '/v4/vis/course/live/video/asyncCreateLive.json',
    'course.live.LiveVideoController',
    'asyncCreateLive',
  ],
  // 轮询异步创建直播频道的结果
  [
    'GET',
    '/v4/vis/course/live/video/getAsyncCreateStatus.json',
    'course.live.LiveVideoController',
    'getAsyncCreateStatus',
  ],
  // 查询视频直播剩余能力
  [
    'GET',
    '/v4/vis/course/live/video/liveVideoSurplus.json',
    'course.live.LiveVideoController',
    'liveVideoSurplus',
  ],
  // 视频直播创建前校验
  [
    'GET',
    '/v4/vis/course/live/video/liveVideoCreateCheck.json',
    'course.live.LiveVideoController',
    'liveVideoCreateCheck',
  ],
  // 获取进入直播间信息
  [
    'GET',
    '/v4/vis/course/live/video/getLiveEnterInfo.json',
    'course.live.LiveVideoController',
    'getLiveEnterInfo',
  ],
  // 新增助教
  [
    'POST',
    '/v4/vis/course/live/video/addRole.json',
    'course.live.LiveVideoController',
    'addRole',
  ],
  // 删除助教
  [
    'POST',
    '/v4/vis/course/live/video/deleteRole.json',
    'course.live.LiveVideoController',
    'deleteRole',
  ],
  // 删除助教
  [
    'POST',
    '/v4/vis/course/live/video/updateRole.json',
    'course.live.LiveVideoController',
    'updateRole',
  ],
  // 开启/关闭回放
  [
    'POST',
    '/v4/vis/course/live/video/playbackOpen.json',
    'course.live.LiveVideoController',
    'playbackOpen',
  ],
  // 视频直播统计
  [
    'GET',
    '/v4/vis/course/live/video/liveVideoSurveyV2.json',
    'course.live.LiveVideoController',
    'liveVideoSurveyV2',
  ],
  // 刷新 & 视频直播统计
  [
    'GET',
    '/v4/vis/course/live/video/refreshSurveyV2.json',
    'course.live.LiveVideoController',
    'refreshSurveyV2',
  ],
  // 充值
  [
    'POST',
    '/v4/vis/course/live/video/confirmRecharge.json',
    'course.live.LiveVideoController',
    'confirmRecharge',
  ],
  /**************************************/
  /*            直播间管理API             */
  /**************************************/
  [
    // 直播间管理
    'GET',
    ['/v4/vis/course/live/live-manage', '/v4/vis/pct/page/live-manage'],
    'course.live.LiveController',
    ['initVisPage', 'getLiveManageHtml'],
  ],
  [
    'GET',
    '/v4/vis/course/live/api/livePlayBackList.json', // 获取回放列表
    'course.live.LiveController',
    'livePlayBackList',
  ],
  [
    'POST',
    '/v4/vis/course/live/api/playBackOrder.json', // 回放列表拖拽排序
    'course.live.LiveController',
    'playBackOrder',
  ],
  [
    'POST',
    '/v4/vis/course/live/api/deletePlayBackLive.json', // 删除回放视频
    'course.live.LiveController',
    'deletePlayBackLive',
  ],
  [
    'GET',
    '/v4/vis/course/live/api/getLiveSetting.json', // 获取直播间设置
    'course.live.LiveController',
    'getLiveSetting',
  ],
  [
    'POST',
    '/v4/vis/course/live/api/updateLiveSetting.json', // 更新直播间设置
    'course.live.LiveController',
    'updateLiveSetting',
  ],
  [
    'GET',
    '/v4/vis/course/live/api/getLiveFlowDetail.json', // 获取直播其他配置，例如是否开启回放
    'course.live.LiveController',
    'getLiveFlowDetail',
  ],
  [
    'POST',
    '/v4/vis/course/live/api/updateTeacher.json', // 更新讲师
    'course.live.LiveController',
    'updateTeacher',
  ],
  [
    'POST',
    '/v4/vis/course/live/api/setReplayState.json', // 更新回放设置
    'course.live.LiveController',
    'operatorPlaybackWithStatus',
  ],
  [
    'GET',
    '/v4/vis/course/live/api/getLiveSurvey.json', // 查询直播概况
    'course.live.LiveVideoController',
    'getLiveSurvey',
  ],
  [
    'GET',
    '/v4/vis/course/live/api/listDateTrend.json', // 查询数据趋势
    'course.live.LiveVideoController',
    'listDateTrend',
  ],
  [
    'GET',
    '/v4/vis/course/live/api/listWatchDetail.json', // 查询学习明细
    'course.live.LiveVideoController',
    'listWatchDetail',
  ],
  [
    'GET',
    '/v4/vis/course/live/api/exportLiveDetail.json', // 导出直播详情
    'course.live.LiveVideoController',
    'exportLiveDetail',
  ],
  // 打赏配置
  [
    'POST',
    '/v4/vis/course/live/api/liveRewardSetting.json', // 获取回放列表
    'course.live.LiveVideoController',
    'liveRewardSetting',
  ],
  // 查询打赏配置
  [
    'GET',
    '/v4/vis/course/live/api/getLiveRewardSetting.json', // 获取回放列表
    'course.live.LiveVideoController',
    'getLiveRewardSetting',
  ],
  // 打赏简要记录查询
  [
    'GET',
    '/v4/vis/course/live/api/queryRewardBriefInfo.json', // 获取回放列表
    'course.live.LiveVideoController',
    'queryRewardBriefInfo',
  ],
  // 获取打赏明细
  [
    'GET',
    '/v4/vis/course/live/api/findByCondition.json', // 获取回放列表
    'course.live.LiveVideoController',
    'findByCondition',
  ],
  // 打赏记录导出
  [
    'GET',
    '/v4/vis/course/live/api/exportByCondition.json',
    'course.live.LiveVideoController',
    'exportByCondition',
  ],
  // 分页查询直播间的抽奖记录
  [
    'GET',
    '/v4/vis/course/live/api/findWinLotteryPage.json',
    'course.live.LiveController',
    'findWinLotteryPage',
  ],
  // 提交直播间中奖记录的导出任务
  [
    'POST',
    '/v4/vis/course/live/api/submitExportTask.json',
    'course.live.LiveController',
    'submitExportTask',
  ],
];
