module.exports = [
  [
    // 班级管理
    'GET',
    ['/v4/vis/edu/page/educlass'],
    'edu-admin.educlass.PageController',
    ['init', 'getIndexHtml'],
  ],
];
