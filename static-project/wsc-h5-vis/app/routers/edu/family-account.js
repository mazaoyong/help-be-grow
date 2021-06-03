/**
 * 家庭账号相关接口
 */
module.exports = [
  [
    // 家庭账号主页
    'GET',
    '/wscvis/edu/family-account/detail',
    'edu.FamilyAccountController',
    'getFamilyAccountIndex',
  ],

  [
    // 邀请链接主页
    'GET',
    '/wscvis/edu/family-account/invite',
    'edu.FamilyAccountController',
    'getFamilyAccountInviteIndex',
  ],

  [
    // 邀请链接结果页
    'GET',
    '/wscvis/edu/family-account/invite/*',
    'edu.FamilyAccountController',
    'getFamilyAccountInviteIndex',
  ],

  [
    // 接受邀请
    'POST',
    '/wscvis/edu/family-account/confirm.json',
    'edu.FamilyAccountController',
    'confirm',
  ],

  [
    // 生成邀请海报
    'POST',
    '/wscvis/edu/family-account/getInvitePoster.json',
    'edu.PosterController',
    'getInvitePoster',
  ],

  [
    // 获取学员列表
    'GET',
    '/wscvis/edu/family-account/findSimpleByUserId.json',
    'edu.FamilyAccountController',
    'findSimpleByUserId',
  ],

  [
    // 邀请信息(邀请主页)
    'GET',
    '/wscvis/edu/family-account/getInvitationInfo.json',
    'edu.FamilyAccountController',
    'getInvitationInfo',
  ],

  [
    // 公众号关注
    'GET',
    '/wscvis/edu/family-account/getMpAccount.json',
    'edu.FamilyAccountController',
    'getMpAccountV2',
  ],

  [
    // 链接倒计时
    'GET',
    '/wscvis/edu/family-account/getInvitationByCode.json',
    'edu.FamilyAccountController',
    'getInvitationByCode',
  ],

  [
    // 当前用户的家庭账号信息
    'GET',
    '/wscvis/edu/family-account/getAccount.json',
    'edu.FamilyAccountController',
    'getAccount',
  ],

  [
    'POST',
    '/wscvis/edu/family-account/cancel.json',
    'edu.FamilyAccountController',
    'cancel',
  ],

  [
    'POST',
    '/wscvis/edu/family-account/remove.json',
    'edu.FamilyAccountController',
    'remove',
  ],

  [
    // 发起邀请
    'POST',
    '/wscvis/edu/family-account/invite.json',
    'edu.FamilyAccountController',
    'invite',
  ],

  [
    // 获取店铺id
    'GET',
    '/wscvis/edu/family-account/getShopName.json',
    'edu.FamilyAccountController',
    'getShopName',
  ],

  [
    // 获取邀请状态
    'GET',
    '/wscvis/edu/family-account/getInviteState.json',
    'edu.FamilyAccountController',
    'getInviteState',
  ],

];
