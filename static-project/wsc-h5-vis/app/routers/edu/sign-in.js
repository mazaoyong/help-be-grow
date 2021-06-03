/**
 * 我的课程表相关接口
 */
module.exports = [
  [
    // 签到列表页
    'GET',
    '/wscvis/edu/sign-in-list',
    'edu.RenderController',
    'renderSignInListHtml',
  ],
  [
    // 签到结果页
    'GET',
    '/wscvis/edu/sign-in-result',
    'edu.RenderController',
    'renderSignInResultHtml',
  ],
  [
    // 课节的资产列表页面
    'GET',
    '/wscvis/edu/sign-in-assets',
    'edu.RenderController',
    'renderSignInAssetsHtml',
  ],
  [
    // 获取用户的可签到列表
    'GET',
    '/wscvis/edu/signIn/getLessons.json',
    'edu.SignInController',
    'findStudentLessons',
  ],
  [
    // 签到
    'POST',
    '/wscvis/edu/signIn/signIn.json',
    'edu.SignInController',
    'signIn',
  ],
  [
    // 资产签到
    'POST',
    '/wscvis/edu/signIn/signInWithAssets.json',
    'edu.SignInController',
    'signInWithAssets',
  ],
  [
    // 获取签到数据
    'GET',
    '/wscvis/edu/signIn/signInResult.json',
    'edu.SignInController',
    'getStudentLessonAfterSignIn',
  ],
  [
    // 获取签到成功的加群推广信息
    'GET',
    '/wscvis/edu/signIn/signInResultQrcode.json',
    'edu.SignInController',
    'getPromote',
  ],
  [
    // 获取签到的资产
    'GET',
    '/wscvis/edu/signIn/findUserAssetsForSignIn.json',
    'edu.SignInController',
    'findUserAssetsForSignIn',
  ],
];
