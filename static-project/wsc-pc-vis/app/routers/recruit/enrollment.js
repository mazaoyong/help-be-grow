module.exports = [
  ['GET', '/v4/vis/edu/page/enrollment', 'recruit.EnrollmentController', 'getIndexHtml'],
  ['GET', '/v4/vis/edu/page/signUpCerti', 'recruit.EnrollmentController', 'getCertificateHtml'],
  ['GET', '/v4/vis/edu/enrollment/findStudentAndClueInfoByNameOrPhoneNumber.json', 'recruit.EnrollmentController', 'findStudentAndClueInfoByNameOrPhoneNumber'],
  ['GET', '/v4/vis/edu/enrollment/findOfflineCourseWithCondition.json', 'recruit.EnrollmentController', 'findOfflineCourseWithCondition'],
  ['GET', '/v4/vis/edu/enrollment/findOfflineCourseWithConditionV2.json', 'recruit.EnrollmentController', 'findOfflineCourseWithConditionV2'],
  ['POST', '/v4/vis/edu/enrollment/submitOfflineEnrollmentOrder.json', 'recruit.EnrollmentController', 'submitOfflineEnrollmentOrder'],
  ['GET', '/v4/vis/edu/enrollment/getPayToolsByEduKdtId.json', 'recruit.EnrollmentController', 'getPayToolsByEduKdtId'],
  ['POST', '/v4/vis/edu/enrollment/pay.json', 'recruit.EnrollmentController', 'pay'],
  ['POST', '/v4/vis/edu/enrollment/invisibleOrderById.json', 'recruit.EnrollmentController', 'invisibleOrderById'],
  ['POST', '/v4/vis/edu/enrollment/cancelOrderByNo.json', 'recruit.EnrollmentController', 'cancelOrderByNo'],
  ['GET', '/v4/vis/edu/enrollment/getOrderInfo.json', 'recruit.EnrollmentController', 'getOrderInfo'],
  ['GET', '/v4/vis/edu/enrollment/findStaff.json', 'recruit.EnrollmentController', 'findStaff'],
  ['GET', '/v4/vis/edu/enrollment/getStaffList.json', 'recruit.EnrollmentController', 'getStaffList'],
  ['GET', '/v4/vis/edu/enrollment/getStaff.json', 'recruit.EnrollmentController', 'getStaff'],
  ['GET', '/v4/vis/edu/enrollment/getStudentByNameAndMobile.json', 'recruit.EnrollmentController', 'getStudentByNameAndMobile'],
  ['GET', '/v4/vis/edu/enrollment/getPreLinkInfo.json', 'recruit.EnrollmentController', 'getPreLinkInfo'],
  ['POST', '/v4/vis/edu/enrollment/linkCourse.json', 'recruit.EnrollmentController', 'linkCourse'],
  ['GET', '/v4/vis/edu/enrollment/getQrcode.json', 'recruit.EnrollmentController', 'getQrcode'],
  ['GET', '/v4/vis/edu/enrollment/getReceiptV2.json', 'recruit.EnrollmentController', 'getReceiptV2']
];