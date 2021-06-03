module.exports = [
  [
    // 留言管理
    'GET',
    '/v4/vis/pct/page/comment',
    'edu-admin.CommentController',
    ['initVisPage', 'getIndexHtml'],
  ],

  [
    // 未读留言数目
    'GET',
    '/v4/vis/pct/page/getNonReadCommentsCount.json',
    'edu-admin.CommentController',
    'getNonReadCommentsCountByKdtId',
  ],

  // B端分页获取评论列表
  [
    'GET',
    '/v4/vis/pct/getCommentPageForShop.json',
    'edu-admin.CommentController',
    'getCommentPageForShop',
  ],
  // B端置顶评论
  [
    'POST',
    '/v4/vis/pct/setCommentChosenSticky.json',
    'edu-admin.CommentController',
    'setCommentChosenSticky',
  ],
  // B端批量隐藏评论
  [
    'POST',
    '/v4/vis/pct/setBatchCommentChosenSticky.json',
    'edu-admin.CommentController',
    'setBatchCommentChosenSticky',
  ],
  // B端回复评论
  ['POST', '/v4/vis/pct/replyComment.json', 'edu-admin.CommentController', 'replyComment'],
  // B端删除评论
  ['POST', '/v4/vis/pct/deleteComment.json', 'edu-admin.CommentController', 'deleteComment'],
  // 获取一家店的知识付费的所有内容的未读评论总数
  // ['GET', '/v4/vis/pct/getNonReadCommentsCountByKdtId.json', 'edu-admin.CommentController', 'getNonReadCommentsCountByKdtIdV2'],
  // 点开内容的评论后，评论数清零
  ['POST', '/v4/vis/pct/readComments.json', 'edu-admin.CommentController', 'readComments'],
  // 留言课程列表
  ['GET', '/v4/vis/pct/findPageByKdtId.json', 'edu-admin.CommentController', 'findPageByKdtId'],
];
