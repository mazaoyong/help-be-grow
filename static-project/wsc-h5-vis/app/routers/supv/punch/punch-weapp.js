/**
 * @deprecated 已废弃，移步 routers/supv/punch
 * 群打卡接口
 */
module.exports = [
  /* 任务相关接口 */

  // 获取打卡详情
  ['GET', '/wscvis/punch/getTaskDetail', 'supv.punch.TaskController', 'getTaskDetail'],
  // 获取日签信息
  ['GET', '/wscvis/punch/getShareCardInfo', 'supv.punch.TaskController', 'getShareCardInfo'],
  // 生成用户
  ['POST', '/wscvis/punch/generateUser', 'supv.punch.PunchController', 'generateUser'],
  // 获取打卡任务要求
  ['GET', '/wscvis/punch/getTaskContent', 'supv.punch.TaskController', 'getTaskContent'],
  // 获取打卡任务详情
  ['GET', '/wscvis/punch/getTaskContentByDate', 'supv.punch.TaskController', 'getTaskContentByDate'],

  /* 日记相关接口 */

  // 获取日记列表
  ['GET', '/wscvis/punch/getDiaryList', 'supv.punch.DiaryController', 'getDiaryList'],
  // 获取单篇日记和评论
  ['GET', '/wscvis/punch/getDiary', 'supv.punch.DiaryController', 'getDiary'],
  // 获取打卡日记详情
  ['GET', '/wscvis/punch/getMyGciLog', 'supv.punch.DiaryController', 'getMyGciLog'],
  ['POST', '/wscvis/punch/postUpdatePunchData', 'supv.punch.DiaryController', 'postUpdatePunchData'],
  // 点赞
  ['GET', '/wscvis/punch/getLikeList', 'supv.punch.DiaryController', 'getLikeList'],
  ['GET', '/wscvis/punch/postLike', 'supv.punch.DiaryController', 'postLike'],
  ['GET', '/wscvis/punch/postCancelLike', 'supv.punch.DiaryController', 'postCancelLike'],
  // 评论
  ['POST', '/wscvis/punch/postComment', 'supv.punch.DiaryController', 'postComment'],
  ['POST', '/wscvis/punch/postCommentOnDiary', 'supv.punch.DiaryController', 'postCommentOnDiary'],
  ['GET', '/wscvis/punch/deleteComment', 'supv.punch.DiaryController', 'deleteComment'],
  ['GET', '/wscvis/punch/getStudentsComments', 'supv.punch.DiaryController', 'getStudentsComments'],
  ['GET', '/wscvis/punch/getTeacherComments', 'supv.punch.DiaryController', 'getTeacherComments'],

  /* 打卡相关接口 */

  ['GET', '/wscvis/punch/getAllPunchList', 'supv.punch.PunchController', 'getAllPunchList'],
  ['GET', '/wscvis/punch/getBoughtList', 'supv.punch.PunchController', 'getBoughtList'],
  ['GET', '/wscvis/punch/getFeatureList', 'supv.punch.PunchController', 'getFeatureList'],
  ['GET', '/wscvis/punch/uploadMaterialToken', 'supv.punch.PunchController', 'uploadMaterialToken'],
  // 判断专栏是否已关联打卡
  ['POST', '/wscvis/supv/punch/getSupportPunches', 'supv.punch.PunchController', 'getSupportPunches'],
  ['GET', '/wscvis/supv/punch/getSupportPunch', 'supv.punch.PunchController', 'getSupportPunch'],
  ['GET', '/wscvis/punch/getPunchDetailByAlias', 'supv.punch.PunchController', 'getPunchDetailByAlias'],
  // 获取打卡介绍页详细信息
  ['GET', '/wscvis/punch/getIntroDesc', 'supv.punch.PunchController', 'getIntroDesc'],
  // 获取专辑的信息
  ['GET', '/wscvis/punch/getColumn', 'supv.punch.PunchController', 'getColumn'],
  // 验证密码
  ['POST', '/wscvis/punch/postValidatePassword', 'supv.punch.PunchController', 'postValidatePassword'],
  // 提交打卡数据
  ['POST', '/wscvis/punch/postAddPunchData', 'supv.punch.PunchController', 'postAddPunchData'],
  // 页面加载日历和任务详情
  ['GET', '/wscvis/punch/getCalenderDetail', 'supv.punch.PunchController', 'getCalenderDetail'],
  // 获取个人信息
  ['GET', '/wscvis/punch/getPersonRank', 'supv.punch.PunchController', 'getPersonRank'],
  // 获取打卡排行榜列表
  ['GET', '/wscvis/punch/getRankList', 'supv.punch.PunchController', 'getRankList'],
];
