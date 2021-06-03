module.exports = [
  [
    'GET',
    '/v4/vis/stat/attendance',
    'other.stat.AttendanceStatController',
    'getIndexHtml',
  ],
  // 导出记录页面，配置单独路由，'/v4/vis/pct/page/record'该路由绑定了知识付费权限点
  [
    'GET',
    ['/v4/vis/stat/export/attendance', '/v4/vis/stat/export/consume'],
    'other.stat.AttendanceStatController',
    ['initVisPage', 'getExportHtml'],
  ],
  [
    'GET',
    '/v4/vis/stat/attendance/getAttendanceOverview.json',
    'other.stat.AttendanceStatController',
    'getAttendanceOverview',
  ],
  [
    'GET',
    '/v4/vis/stat/attendance/findAttendClassDetailPage.json',
    'other.stat.AttendanceStatController',
    'findAttendClassDetailPage',
  ],
  [
    'POST',
    '/v4/vis/stat/attendance/exportAttendClassDetail.json',
    'other.stat.AttendanceStatController',
    'exportAttendClassDetail',
  ],
];
