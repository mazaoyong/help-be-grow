module.exports = [
  [
    // 获取当前页面的自定义资料项
    'GET',
    '/wscvis/edu/student-edit/profile-list.json',
    'edu.StudentController',
    'getProfileListJSON',
  ],
  [
    'GET',
    '/wscvis/edu/profile/get-remote-conf.json',
    'edu.StudentController',
    'getRemoteConfJSON',
  ],
];
