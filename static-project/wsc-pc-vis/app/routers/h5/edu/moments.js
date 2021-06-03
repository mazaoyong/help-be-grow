module.exports = [
  ['GET', '/v4/vis/h5/edu/moments/post-edit', 'h5.moments.IndexController', 'getIndexHtml'],
  ['GET', '/v4/vis/h5/edu/moments/post-edit/*', 'h5.moments.IndexController', 'getIndexHtml'],

  // 海报页
  ['GET', '/v4/vis/h5/edu/moments/poster', 'h5.moments.IndexController', 'getPosterHtml'],
  ['GET', '/v4/vis/h5/edu/moments/poster/findPostDetail.json', 'h5.moments.PosterController', 'findPostDetail'],
  // 家校圈feed流入口
  ['GET', '/v4/vis/h5/edu/moments/feeds', 'h5.moments.IndexController', 'getFeedsIndexHtml'],
  // 家校圈详情
  ['GET', '/v4/vis/h5/edu/moments/feeds/detail/*', 'h5.moments.IndexController', 'getFeedsDetailIndexHtml'],
  // 消息盒子
  ['GET', '/v4/vis/h5/edu/moments/messagebox', 'h5.moments.IndexController', 'getMessageBoxIndexHtml'],
  ['GET', '/v4/vis/h5/edu/moments/findUserMessages.json', 'h5.moments.FeedsController', 'findUserMessagesJSON'],

  // 获取家校圈动态列表
  [
    'GET',
    '/v4/vis/h5/edu/moments/feeds/getFeedList.json',
    'h5.moments.FeedsController',
    'getFeedListJSON',
  ],

  // 获取老师信息
  ['GET', '/v4/vis/h5/edu/moments/getTeacherInfo.json', 'h5.moments.FeedsController', 'getTeacherInfoJSON'],
  // 删除动态
  ['POST', '/v4/vis/h5/edu/moments/feeds/deleteReview.json', 'h5.moments.FeedsController', 'deleteReview'],
  // 点赞
  ['POST', '/v4/vis/h5/edu/moments/feeds/createLike.json', 'h5.moments.FeedsController', 'createLike'],
  // 取消点赞
  ['POST', '/v4/vis/h5/edu/moments/feeds/deleteLike.json', 'h5.moments.FeedsController', 'deleteLike'],
  // 评论
  ['POST', '/v4/vis/h5/edu/moments/feeds/createComment.json', 'h5.moments.FeedsController', 'createComment'],
  // 删除评论
  ['POST', '/v4/vis/h5/edu/moments/feeds/deleteComment.json', 'h5.moments.FeedsController', 'deleteComment'],
  ['GET', '/v4/vis/h5/edu/moments/feeds/findComments.json', 'h5.moments.FeedsController', 'findComments'],

  // 点评编辑页
  ['GET', '/v4/vis/h5/edu/moments/posterEdit/getPostById.json', 'h5.moments.PostEditController', 'getPostById'],
  ['POST', '/v4/vis/h5/edu/moments/posterEdit/createReview.json', 'h5.moments.PostEditController', 'createReview'],
  ['POST', '/v4/vis/h5/edu/moments/posterEdit/updateReview.json', 'h5.moments.PostEditController', 'updateReview'],
  ['GET', '/v4/vis/h5/edu/moments/posterEdit/findLocationInfo.json', 'h5.moments.PostEditController', 'findLocationInfo'],

  // 查机构学员
  ['GET', '/v4/vis/h5/edu/moments/findStudentsForReview.json', 'h5.moments.AddStudentController', 'findStudentsForReview'],
  ['GET', '/v4/vis/h5/edu/moments/findRecentReviewedStudents.json', 'h5.moments.AddStudentController', 'findRecentReviewedStudents'],
  ['GET', '/v4/vis/h5/edu/moments/findStudentsOnLesson.json', 'h5.moments.AddStudentController', 'findStudentsOnLesson'],

  // 时间轴
  ['GET', '/v4/vis/h5/edu/moments/timeline', 'h5.moments.IndexController', 'getTimelineHtml'],
  ['GET', '/v4/vis/h5/edu/moments/timeline/findPostsForStaff.json', 'h5.moments.TimelineController', 'findPostsForStaff'],
  ['GET', '/v4/vis/h5/edu/moments/timeline/findMessageBox.json', 'h5.moments.TimelineController', 'findMessageBox'],
  ['GET', '/v4/vis/h5/edu/moments/findUserBadge.json', 'h5.moments.TimelineController', 'findUserBadge'],

  // 更换家校圈封面
  ['POST', '/v4/vis/h5/edu/moments/updateCover.json', 'h5.moments.FeedsController', 'updateCover'],
];
