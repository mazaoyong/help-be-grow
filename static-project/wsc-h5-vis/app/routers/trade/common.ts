/**
 * 因为跨域问题，下单host需要新包一些http路由，存放在这里
 */
export = [
  // 下单页获取学员信息列表
  [
    'GET',
    '/pay/wscvis_trade/edu/student/list.json',
    'edu.StudentFacadeController',
    'getFindByTradeStudentQueryJson',
  ],
  // 下单页获取地址列表
  [
    'GET',
    '/pay/wscvis_trade/edu/address/list.json',
    'edu.CourseController',
    'getAddressList',
  ],
  // 下单页用来为知识付费商品补全基础商品信息
  [
    'GET',
    '/pay/wscvis_trade/course/list.json',
    'common.ProductCommonController',
    'findSimpleCourseListJson',
  ],
  // 直播详情
  [
    'GET',
    '/pay/wscvis_trade/course/live.json',
    'course.detail.DetailController',
    'getLiveJson',
  ],
];
