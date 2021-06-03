module.exports = [
  // 直播等待页
  [
    'GET',
    '/wscvis/course/live/waiting',
    'course.live.LiveWaitingController',
    ['liveAcl', 'getIndexHtml'],
  ],
  // 视频直播间
  [
    'GET',
    '/wscvis/course/live/video/room',
    'course.live.LiveVideoController',
    ['liveAcl', 'getRoomHtml'],
  ],
  // 获取视频直播链接
  [
    'GET',
    '/wscvis/course/live/video/getEduLiveLink.json',
    'course.live.LiveVideoController',
    'getEduLiveLinkJson',
  ],
  // 直播列表获取
  [
    'GET',
    '/wscvis/course/live/api/findPageForWym.json',
    'course.live.LiveApiController',
    'findPageForWym',
  ],
  // 查询直播间打赏设置
  [
    'GET',
    '/wscvis/course/live/video/getLiveSetting.json',
    'course.live.LiveVideoController',
    'getLiveSettingJson',
  ],
  // 视频直播打赏下单
  [
    'POST',
    '/wscvis/course/live/video/creat.json',
    'course.live.LiveVideoController',
    'createJson',
  ],
];
