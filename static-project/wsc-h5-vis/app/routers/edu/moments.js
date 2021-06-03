module.exports = [
  ['GET', '/wscvis/edu/moments/timeline', 'edu.RenderController', 'getMomentsTimelineHtml'],
  [
    'GET',
    '/wscvis/edu/moments/timeline/findMessageBox.json',
    'edu.MomentsController',
    'findMessageBox',
  ],

  ['GET', '/wscvis/edu/moments/findPostsForUser.json', 'edu.MomentsController', 'findPostsForUser'],
  // 获取家校圈动态列表
  [
    'GET',
    '/wscvis/edu/moments/feeds/getFeedList.json',
    'edu.MomentsController',
    'getFeedListJSON',
  ],

  // 删除动态
  ['POST', '/wscvis/edu/moments/feeds/deleteReview.json', 'edu.MomentsController', 'deleteReview'],
  // 点赞
  ['POST', '/wscvis/edu/moments/feeds/createLike.json', 'edu.MomentsController', 'createLike'],
  // 取消点赞
  ['POST', '/wscvis/edu/moments/feeds/deleteLike.json', 'edu.MomentsController', 'deleteLike'],
  // 评论
  ['POST', '/wscvis/edu/moments/feeds/createComment.json', 'edu.MomentsController', 'createComment'],
  // 删除评论
  ['POST', '/wscvis/edu/moments/feeds/deleteComment.json', 'edu.MomentsController', 'deleteComment'],
  // 获取评论
  ['GET', '/wscvis/edu/moments/feeds/findComments.json', 'edu.MomentsController', 'findComments'],
  // 获取用户信息
  ['GET', '/wscvis/edu/moments/feeds/getUserInfo.json', 'edu.MomentsController', 'getUserInfoJSON'],
  ['GET', '/wscvis/edu/moments/feeds/getTeacherInfo.json', 'edu.MomentsController', 'getTeacherInfoJSON'],

  ['GET', '/wscvis/edu/moments/feeds', 'edu.RenderController', 'getMomentsFeedsHtml'],
  ['GET', '/wscvis/edu/moments/feeds/detail/*', 'edu.RenderController', 'getMomentsFeedDetailsHtml'],
  ['GET', '/wscvis/edu/moments/messagebox', 'edu.RenderController', 'getMessageBoxHtml'],
  // 获取消息列表
  [
    'GET',
    '/wscvis/edu/moments/message-box/findUserMessages.json',
    'edu.MomentsController',
    'findUserMessages',
  ],
  ['GET', '/wscvis/edu/moments/poster', 'edu.RenderController', 'getMomentsPosterHtml'],
  ['GET', '/wscvis/edu/moments/findPostDetail.json', 'edu.MomentsController', 'findPostDetail'],
  ['GET', '/wscvis/edu/moments/getWechatCode.json', 'edu.MomentsController', 'getCommonWeappCode'],

  // 更换家校圈封面
  ['POST', '/wscvis/edu/moments/updateCover.json', 'edu.MomentsController', 'updateCover'],

  // 动态编辑页
  ['GET', '/wscvis/edu/moments/post-edit', 'edu.RenderController', 'getMomentsEditHtml'],
  ['GET', '/wscvis/edu/moments/poster-edit/getPostById.json', 'edu.MomentsController', 'getPostById'],
  ['POST', '/wscvis/edu/moments/poster-edit/createReview.json', 'edu.MomentsController', 'createReview'],
  ['POST', '/wscvis/edu/moments/poster-edit/updateReview.json', 'edu.MomentsController', 'updateReview'],
  ['GET', '/wscvis/edu/moments/poster-edit/getCeresConfig.json', 'edu.MomentsController', 'getCeresConfig'],
];
