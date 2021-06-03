module.exports = [
  // 后台页面
  [
    'GET',
    '/v4/vis/edu/page/moments',
    'ump.MomentsController',
    'getIndexHtml',
  ],
  // 创建动态
  [
    'POST',
    '/v4/vis/edu/moments/createMoments.json',
    'ump.MomentsController',
    'createMoments',
  ],

  // 更新动态
  [
    'POST',
    '/v4/vis/edu/moments/updateMoments.json',
    'ump.MomentsController',
    'updateMoments',
  ],

  // 删除动态
  [
    'POST',
    '/v4/vis/edu/moments/deleteMoments.json',
    'ump.MomentsController',
    'deleteMoments',
  ],

  // 创建回复
  [
    'POST',
    '/v4/vis/edu/moments/createComment.json',
    'ump.MomentsController',
    'createComment',
  ],

  // 删除回复
  [
    'POST',
    '/v4/vis/edu/moments/deleteComment.json',
    'ump.MomentsController',
    'deleteComment',
  ],

  // 动态列表
  [
    'GET',
    '/v4/vis/edu/moments/findMoments.json',
    'ump.MomentsController',
    'findMoments',
  ],

  // 回复列表
  [
    'GET',
    '/v4/vis/edu/moments/findComments.json',
    'ump.MomentsController',
    'findComments',
  ],

  // 查询locationinfo
  [
    'GET',
    '/v4/vis/edu/moments/findLocationInfo.json',
    'ump.MomentsController',
    'findLocationInfo',
  ],

  // 查询学员列表
  [
    'GET',
    '/v4/vis/edu/moments/findStudentsOnLesson.json',
    'ump.MomentsController',
    'findStudentsOnLesson',
  ],

  // 查询学员列表
  [
    'GET',
    '/v4/vis/edu/moments/generateVideoPlayInfo.json',
    'ump.MomentsController',
    'generateVideoPlayInfo',
  ],

  // 获取家校圈配置
  [
    'GET',
    '/v4/vis/edu/moments/getCeresConfig.json',
    'ump.MomentsController',
    'getCeresConfig',
  ],

  // 修改家校圈配置
  [
    'PUT',
    '/v4/vis/edu/moments/updateCeresConfig.json',
    'ump.MomentsController',
    'updateCeresConfig',
  ],

  // B端获取家校圈动态列表
  [
    'GET',
    '/v4/vis/edu/moments/findPosts.json',
    'ump.MomentsController',
    'findPosts',
  ],

  // B端创建动态
  [
    'POST',
    '/v4/vis/edu/moments/createReview.json',
    'ump.MomentsController',
    'createReview',
  ],

  // 获取学员列表
  [
    'GET',
    '/v4/vis/edu/moments/findStudentPageWithCustomer.json',
    'ump.MomentsController',
    'findStudentPageWithCustomer',
  ],
];
