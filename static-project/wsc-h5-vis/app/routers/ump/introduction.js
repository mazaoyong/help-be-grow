// 邀请有奖路由集
module.exports = [
  [
    // 老客活动页
    'GET',
    '/wscvis/ump/introduction/old-student',
    'ump.IntroductionController',
    'getOldStudentHtml',
  ],
  [
    // 新客活动页
    'GET',
    '/wscvis/ump/introduction/new-student',
    'ump.IntroductionController',
    'getNewStudentHtml',
  ],
  [
    // 以前的老客活动页
    'GET',
    '/wscvis/ump/introduction/previous-old-student',
    'ump.IntroductionController',
    'getPreviousOldStudentHtml',
  ],
  [
    // 海报页面
    'GET',
    '/wscvis/ump/introduction/previous-invite-poster',
    'ump.IntroductionController',
    'getInvitePosterHtml',
  ],
  ['GET', '/wscvis/ump/introduction/old-student-preview', 'ump.IntroductionController', 'getOldStudentPreviewHtml'],
  ['GET', '/wscvis/ump/introduction/new-student-preview', 'ump.IntroductionController', 'getNewStudentPreviewHtml'],
  [
    // 服务端绘制海报
    'POST',
    '/wscvis/ump/poster/getIntroductionPoster.json',
    'ump.PosterController',
    'getIntroductionPoster',
  ],
  [
    // 查找店铺中最新正在进行中的活动
    'GET',
    '/wscvis/ump/introduction/getIntroductionActivity.json',
    'ump.IntroductionController',
    'getIntroductionActivity',
  ],
  [
    // 被介绍人（新学员）的活动页面信息
    'GET',
    '/wscvis/ump/introduction/getRefereeActivityDetail.json',
    'ump.IntroductionController',
    'getRefereeActivityDetail',
  ],
  [
    // 活动鉴权（只有老学员参与）
    'GET',
    '/wscvis/ump/introduction/checkActivityThreshold.json',
    'ump.IntroductionController',
    'checkActivityThreshold',
  ],
  [
    // 邀请记录
    'GET',
    '/wscvis/ump/introduction/findIntroduceRecord.json',
    'ump.IntroductionController',
    'findIntroduceRecord',
  ],
  [
    // 图片涉黄
    'GET',
    '/wscvis/ump/introduction/imageAppraise.json',
    'ump.IntroductionController',
    'imageAppraise',
  ],
  [
    // 获取活动参数人数
    'GET',
    '/wscvis/ump/introduction/getActivityParticipatePeople.json',
    'ump.IntroductionController',
    'getActivityParticipatePeople',
  ],
  [
    // 点赞
    'GET',
    '/wscvis/ump/introduction/collectZan.json',
    'ump.IntroductionController',
    'collectZan',
  ],
  [
    // 门槛为需分享时，生成分享记录
    'GET',
    '/wscvis/ump/introduction/refereeShareActivity.json',
    'ump.IntroductionController',
    'refereeShareActivity',
  ],
  [
    // 领取奖励
    'GET',
    '/wscvis/ump/introduction/receiveAward.json',
    'ump.IntroductionController',
    'receiveAward',
  ],
  [
    // 查询活动需要的资料项
    'GET',
    '/wscvis/ump/introduction/getIntroductionAttribute.json',
    'ump.IntroductionController',
    'getIntroductionAttribute',
  ],
  [
    // 获取验证码
    'GET',
    '/wscvis/ump/introduction/sendVerifyCode.json',
    'ump.IntroductionController',
    'sendVerifyCode',
  ],
  [
    // 提交资料项
    'POST',
    '/wscvis/ump/introduction/confirmIntroductionAttributeItem.json',
    'ump.IntroductionController',
    'confirmIntroductionAttributeItem',
  ],
  [
    // 助力海报
    'GET',
    '/wscvis/ump/poster/getBoostPoster.json',
    'ump.PosterController',
    'getBoostPoster',
  ],
  ['GET', '/wscvis/ump/introduction/getOldStudentSummary.json', 'ump.IntroductionController', 'getOldStudentSummary'],
  [
    'GET',
    '/wscvis/ump/introduction/getCollectZanUserStatus.json',
    'ump.IntroductionController',
    'getCollectZanUserStatus',
  ],
  ['GET', '/wscvis/ump/introduction/studentIdentityCheck.json', 'ump.IntroductionController', 'studentIdentityCheck'],
  ['GET', '/wscvis/ump/introduction/refererShareActivity.json', 'ump.IntroductionController', 'refererShareActivity'],
  ['GET', '/wscvis/ump/introduction/getHelperList.json', 'ump.IntroductionController', 'getHelperList'],
];
