const routePrefix = '/wscvis/supv/punch';
const controllerPath = 'supv.punch.IndexController';

/**
 * 群打卡接口
 */
module.exports = [
  // 获取日签/长图海报图
  ['POST', `${routePrefix}/getSharePoster.json`, controllerPath, 'getSharePoster'],

  /* 渲染服务 */
  ['GET', '/wscvis/supv/punch/introduction', 'supv.punch.RenderController', 'renderIntroductionHtml'],
  ['GET', '/wscvis/supv/punch/edit', 'supv.punch.RenderController', 'renderEditHtml'],
  ['GET', '/wscvis/supv/punch/task', 'supv.punch.RenderController', 'getPunchTaskIndex'],
  ['GET', '/wscvis/supv/punch/detail', 'supv.punch.RenderController', 'renderDetail'],
  ['GET', '/wscvis/supv/punch/rank', 'supv.punch.RenderController', 'renderRank'],

  /* 任务相关接口 */

  // 获取打卡详情
  ['GET', '/wscvis/supv/punch/getTaskDetail.json', 'supv.punch.TaskController', 'getTaskDetail'],
  // 获取日签信息
  ['GET', '/wscvis/supv/punch/getShareCardInfo.json', 'supv.punch.TaskController', 'getShareCardInfo'],
  // 生成用户
  ['POST', '/wscvis/supv/punch/generateUser.json', 'supv.punch.PunchController', 'generateUser'],
  // 获取打卡任务要求
  ['GET', '/wscvis/supv/punch/getTaskContent.json', 'supv.punch.TaskController', 'getTaskContent'],
  // 获取打卡任务详情
  ['GET', '/wscvis/supv/punch/getTaskContentByDate.json', 'supv.punch.TaskController', 'getTaskContentByDate'],

  /* 日记相关接口 */

  // 获取日记列表
  ['GET', '/wscvis/supv/punch/getDiaryList.json', 'supv.punch.DiaryController', 'getDiaryList'],
  // 获取单篇日记和评论
  ['GET', '/wscvis/supv/punch/getDiary.json', 'supv.punch.DiaryController', 'getDiary'],
  // 获取打卡日记详情
  ['GET', '/wscvis/supv/punch/getMyGciLog.json', 'supv.punch.DiaryController', 'getMyGciLog'],
  ['POST', '/wscvis/supv/punch/postUpdatePunchData.json', 'supv.punch.DiaryController', 'postUpdatePunchData'],
  // 点赞
  ['GET', '/wscvis/supv/punch/getLikeList.json', 'supv.punch.DiaryController', 'getLikeList'],
  ['GET', '/wscvis/supv/punch/postLike.json', 'supv.punch.DiaryController', 'postLike'],
  ['GET', '/wscvis/supv/punch/postCancelLike.json', 'supv.punch.DiaryController', 'postCancelLike'],
  // 评论
  ['POST', '/wscvis/supv/punch/postComment.json', 'supv.punch.DiaryController', 'postComment'],
  ['POST', '/wscvis/supv/punch/postCommentOnDiary.json', 'supv.punch.DiaryController', 'postCommentOnDiary'],
  ['GET', '/wscvis/supv/punch/deleteComment.json', 'supv.punch.DiaryController', 'deleteComment'],
  ['GET', '/wscvis/supv/punch/getStudentsComments.json', 'supv.punch.DiaryController', 'getStudentsComments'],
  ['GET', '/wscvis/supv/punch/getTeacherComments.json', 'supv.punch.DiaryController', 'getTeacherComments'],

  /* 打卡相关接口 */

  ['GET', '/wscvis/supv/punch/getBoughtList.json', 'supv.punch.PunchController', 'getBoughtList'],
  ['GET', '/wscvis/supv/punch/getFeatureList.json', 'supv.punch.PunchController', 'getFeatureList'],
  ['GET', '/wscvis/supv/punch/uploadMaterialToken.json', 'supv.punch.PunchController', 'uploadMaterialToken'],
  // 判断专栏是否已关联打卡
  ['POST', '/wscvis/supv/punch/getSupportPunches.json', 'supv.punch.PunchController', 'getSupportPunches'],
  ['GET', '/wscvis/supv/punch/getSupportPunch.json', 'supv.punch.PunchController', 'getSupportPunch'],
  ['GET', '/wscvis/supv/punch/getPunchDetailByAlias.json', 'supv.punch.PunchController', 'getPunchDetailByAlias'],
  // 获取打卡介绍页详细信息
  ['GET', '/wscvis/supv/punch/getIntroDesc.json', 'supv.punch.PunchController', 'getIntroDesc'],
  // 获取专辑的信息
  ['GET', '/wscvis/supv/punch/getColumn.json', 'supv.punch.PunchController', 'getColumn'],
  // 验证密码
  ['POST', '/wscvis/supv/punch/postValidatePassword.json', 'supv.punch.PunchController', 'postValidatePassword'],
  // 提交打卡数据
  ['POST', '/wscvis/supv/punch/postAddPunchData.json', 'supv.punch.PunchController', 'postAddPunchData'],
  // 页面加载日历和任务详情
  ['GET', '/wscvis/supv/punch/getCalenderDetail.json', 'supv.punch.PunchController', 'getCalenderDetail'],
];
