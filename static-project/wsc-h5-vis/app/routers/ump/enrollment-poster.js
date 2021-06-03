module.exports = [
  [
    // 招生海报页面
    'GET',
    '/wscvis/ump/enrollment-poster',
    'ump.EnrollmentPosterController',
    'getIndexHtml',
  ],
  [
    // 获取招生海报信息
    'GET',
    '/wscvis/ump/enrollment-poster/get-by-id.json',
    'ump.EnrollmentPosterController',
    'getById',
  ],
];
