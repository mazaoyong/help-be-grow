/**
 * 教育培训相关接口
 */
module.exports = [
  // 连锁进店—通过校区alias获取另一所校区商品（目前小程序调用
  ['GET', '/wscvis/edu/getCampusProductByCampus.json', 'edu.ChainController', 'getCampusProductByCampusJson'],
  // 连锁-空白页
  ['GET', '/wscvis/edu/empty-page', 'edu.RenderController', 'getEmptyPageIndex'],
  // 海报相关
  ['GET', '/wscvis/cert/getSnopshotByKey.json', 'edu.PosterController', 'getSnopshotByKey'],
  ['GET', '/wscvis/cert/getCertificatePoster.json', 'edu.PosterController', 'getCertificatePoster'],
  // 微信小程序码
  ['GET', '/wscvis/edu/getCommonWeappCode.json', 'edu.PosterController', 'getCommonWeappCode'],
  // 百度小程序码
  ['GET', '/wscvis/edu/getCommonSwanCode.json', 'edu.PosterController', 'getCommonSwanCode'],
  // 学员激励-证书
  ['GET', '/wscvis/edu/certificate/cert-list', 'edu.RenderController', 'getCertificateIndex'],
  ['GET', '/wscvis/edu/findCertificate.json', 'edu.CertificateCustomFacadeController', 'findCertificateJson'],
  [
    'POST',
    '/wscvis/edu/batchUpdatePopStatus.json',
    'edu.CertificateCustomFacadeController',
    'batchUpdatePopStatusJson',
  ],
  ['POST', '/wscvis/edu/batchUpdateStatus.json', 'edu.CertificateCustomFacadeController', 'batchUpdateStatusJson'],
  ['POST', '/wscvis/edu/increaseQrScanNum.json', 'edu.CertificateCustomFacadeController', 'increaseQrScanNumJson'],
  ['GET', '/wscvis/knowledge/qrcode.json', 'common.QRController', 'getQrcodeJson'],
  // 学员资产—学员相关
  ['GET', '/wscvis/edu/findByCustomerId.json', 'edu.StudentController', 'findByCustomerIdJson'],
  ['GET', '/wscvis/edu/getSimpleById.json', 'edu.StudentController', 'getSimpleByIdJson'],
  ['GET', '/wscvis/edu/getStudentInfoByScene.json', 'edu.StudentController', 'getStudentInfoBySceneJson'],
  ['POST', '/wscvis/edu/createOwlStudent.json', 'edu.StudentController', 'createOwlStudentJson'],
  ['PUT', '/wscvis/edu/updateOwlStudent.json', 'edu.StudentController', 'updateOwlStudentJson'],
  ['DELETE', '/wscvis/edu/deleteOwlStudent.json', 'edu.StudentController', 'deleteOwlStudentJson'],
  // 学员资产-线下课相关
  ['GET', '/wscvis/edu/findPageStuSchedule.json', 'edu.ScheduleFacadeController', 'findPageStuScheduleJson'],
  ['GET', '/wscvis/edu/findStuScheduleByCondition.json', 'edu.ScheduleFacadeController', 'findStuScheduleByConditionJson'],
  ['GET', '/wscvis/edu/findWaitingLessonPage.json', 'edu.ScheduleFacadeController', 'findWaitingLessonPageJson'],
  // 学员资产-线下课资产变更相关
  ['GET', '/wscvis/edu/queryAssetOperationPage.json', 'edu.AssetOperationController', 'queryAssetOperationPageJson'],
  // 学员资产—上课记录
  ['GET', '/wscvis/edu/findPageLessonRecord.json', 'edu.StudentLessonController', 'findPageLessonRecordJson'],
  // 学员资产—上课记录V2
  ['GET', '/wscvis/edu/findPageLessonRecordV2.json', 'edu.StudentLessonController', 'findPageLessonRecordV2'],
  // 学员资产—页面路由相关
  ['GET', '/wscvis/edu/course/*', 'edu.RenderController', 'getCourseIndex'],
  ['GET', '/wscvis/edu/course-record', 'edu.RenderController', 'getCourseRecordIndex'],
  ['GET', '/wscvis/edu/course-change/*', 'edu.RenderController', 'getCourseChangeIndex'],
  ['GET', '/wscvis/edu/student/stu-list', 'edu.RenderController', 'getStudentCardIndex'],
  ['GET', '/wscvis/edu/student/stu-edit', 'edu.RenderController', 'getStudentCardEditIndex'],

  // ['GET', '/wscvis/edu/index', 'edu.RenderController', 'getIndexHtml'],
  ['GET', '/wscvis/edu/prod-detail', 'edu.RenderController', ['setUserPoints', 'getProdDetailHtml']],
  ['GET', '/wscvis/edu/address-list', 'edu.RenderController', 'getAddressListHtml'],
  ['GET', '/wscvis/edu/map', 'edu.RenderController', 'getMapHtml'],
  ['GET', '/pay/wscvis_edu_pay', 'edu.RenderController', ['setUserPoints', 'getOrderConfirmHtml']],
  // ['GET', '/wscvis/edu/order-confirm', 'edu.RenderController', 'getOrderConfirmHtml'],
  ['GET', '/wscvis/edu/student-list', 'edu.RenderController', 'getStudentList'],
  ['GET', '/wscvis/edu/all-course', 'edu.RenderController', 'getAllCourseIndex'],
  ['GET', '/wscvis/edu/goods-list', 'edu.RenderController', 'getGoodsListIndex'],

  // 课程分组页面
  ['GET', '/wscvis/edu/course-group', 'edu.RenderController', 'getCourseGroupListIndex'],
  // 获取课程分组信息
  ['GET', '/wscvis/edu/findItemGroupPageForWym.json', 'edu.CourseGroupController', 'findItemGroupPageForWym'],

  // 教育商品列表页
  ['GET', '/wscvis/edu/goods-list.json', 'edu.OwlProductAggregateController', 'fetchGoodsList'],

  // 店铺设置-课程设置
  ['GET', '/wscvis/edu/findCourseSetting.json', 'edu.CourseController', 'findCourseSettings'],

  // 商品详情页
  ['GET', '/wscvis/edu/getCourseDetail.json', 'edu.CourseController', 'getCourseDetailAndActivity'],
  // ['GET', '/wscvis/edu/course/v2/getCourseDetail.json', 'edu.CourseController', 'getCourseDetailV2AndActivity'],
  ['GET', '/wscvis/edu/course-v3/getCourseDetail.json', 'edu.CourseController', 'getCourseDetailV3AndActivity'],
  ['GET', '/wscvis/edu/getEvaluateData.json', 'edu.CourseController', 'getEvaluateData'],
  // 地址列表页
  ['GET', '/wscvis/edu/getAddressList.json', 'edu.CourseController', 'getAddressList'],
  // 下单页预下单
  ['GET', '/wscvis/edu/getPreOrderInfo.json', 'edu.CourseController', 'getPreOrderInfo'],
  // 下单页提交订单
  ['POST', '/wscvis/edu/postOrderConfirm.json', 'edu.CourseController', 'postOrderConfirm'],
  // 下单页获取学员信息
  ['GET', '/wscvis/edu/getStudentDetail.json', 'edu.StudentController', 'getStudentDetail'],

  /**
   * 老师详情页相关
   */
  ['GET', '/wscvis/edu/master-detail', 'edu.RenderController', 'getMasterDetail'],
  // 获取老师信息以及第一页的课程列表信息
  ['GET', '/wscvis/edu/getTeacherInfo.json', 'edu.TeacherFacadeController', 'getTeacherInfoJson'],
  // 获取后续的课程列表信息
  ['GET', '/wscvis/edu/loadMoreCourse.json', 'edu.TeacherFacadeController', 'loadMoreCourseJson'],

  // 获取线下课列表 TOCLEAR 现在还有小程序等地方还在用
  ['GET', '/wscvis/edu/getAllCourseList.json', 'edu.CourseController', 'getAllCourseListJson'],
  // 获取线下课列表 这个是新接口
  ['GET', '/wscvis/edu/course-v2/findPageForWym.json', 'edu.CourseController', 'findPageForWym'],

  // 获取老师列表
  ['GET', '/wscvis/edu/listTeacherForWym.json', 'edu.TeacherFacadeController', 'listTeacherForWym'],

  /**
   * 学员列表相关
   */
  ['GET', '/wscvis/edu/getStudentList.json', 'edu.StudentFacadeController', 'getStudentListJson'],
  // 获取上次选择的学员
  ['GET', '/wscvis/edu/getRecentStudent.json', 'edu.StudentFacadeController', 'getRecentStudentJson'],

  /**
   * 支付相关
   */
  // 支付成功
  // ['GET', '/wscvis/edu/paid-status', 'edu.RenderController', 'getPaidStatus'],
  // 订单状态
  ['GET', '/wscvis/edu/getPayStatement.json', 'edu.CourseController', 'getPayStatementJSON'],

  /**
   * 编辑学员
   */
  ['GET', '/wscvis/edu/student-edit.html', 'edu.RenderController', 'renderStudentEdit'],
  ['GET', '/wscvis/edu/student.json', 'edu.StudentController', 'queryStudent'],
  ['POST', '/wscvis/edu/student.json', 'edu.StudentController', 'createStudent'],
  ['PUT', '/wscvis/edu/student.json', 'edu.StudentController', 'updateStudent'],
  ['DELETE', '/wscvis/edu/student.json', 'edu.StudentController', 'deleteStudent'],

  /**
   * 查课程列表 TOCLEAR 这里错用了B端的接口
   */
  ['GET', '/wscvis/edu/getRecommandCourse.json', 'edu.CourseController', 'getCourseListJson'],

  /**
   * 查课程列表 新接口
  */
  ['GET', '/wscvis/edu/getRecommandCourseV2.json', 'edu.CourseController', 'findPageByCondition'],

  /**
   * 已购买课程
   */
  ['GET', '/wscvis/edu/studentCourse.json', 'edu.StudentController', 'queryStudentCourse'],

  /**
   * 拼团详情页
   */
  // ['GET', '/wscvis/edu/groupon-detail', 'edu.RenderController', 'renderGrouponDetailHtml'],

  /**
   * 从商品中心获取商品库存
   */
  ['GET', '/wscvis/edu/getProductStockFromMall.json', 'edu.CourseController', 'getProductStockFromMallJson'],

  /**
   * 获取支付成功页面的推广入群信息
   */
  ['GET', '/wscvis/edu/getPaidStatusPromote.json', 'edu.CourseController', 'getWechatPromoteJson'],

  /**
   * 检查支付成功页的预约状态
   */
  ['GET', '/wscvis/edu/hasTradeWithLessonAppointment.json', 'edu.CourseController', 'hasTradeWithLessonAppointment'],
];
