// 招生海报
module.exports = [
  [
    // 页面render
    'GET',
    '/v4/vis/ump/enrollment-poster',
    'ump.EnrollmentPosterController',
    'getIndexHtml',
  ],
  [
    // 获取列表
    'GET',
    '/v4/vis/ump/enrollment-poster/list.json',
    'ump.EnrollmentPosterController',
    'getList',
  ],
  [
    // 保存
    'POST',
    '/v4/vis/ump/enrollment-poster/create.json',
    'ump.EnrollmentPosterController',
    'createPoster',
  ],
  [
    // 编辑
    'POST',
    '/v4/vis/ump/enrollment-poster/edit.json',
    'ump.EnrollmentPosterController',
    'editPoster',
  ],
  [
    // 根据id查询
    'GET',
    '/v4/vis/ump/enrollment-poster/getById.json',
    'ump.EnrollmentPosterController',
    'getById',
  ],
  [
    // 删除
    'POST',
    '/v4/vis/ump/enrollment-poster/delete.json',
    'ump.EnrollmentPosterController',
    'deletePoster',
  ],
];
