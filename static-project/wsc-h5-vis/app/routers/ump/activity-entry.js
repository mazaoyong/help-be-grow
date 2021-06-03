module.exports = [
  [
    // 活动中心页面
    'GET',
    ['/wscvis/ump/activity-entry', '/wscvis/ump/activity-entry/:path'],
    'ump.RenderController',
    'renderActivityEntryHtml',
  ],
];
