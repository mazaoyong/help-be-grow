module.exports = [
  ['GET', '/v4/vis/edu/page/adjustcourse', 'recruit.AdjustCourseController', ['initVisPage', 'getIndexHtml']],
  ['POST', '/v4/vis/edu/adjustcourse/getTransferOutCourseDetail.json', 'recruit.AdjustCourseController', 'getTransferOutCourseDetail'],
  ['POST', '/v4/vis/edu/adjustcourse/transferCourse.json', 'recruit.AdjustCourseController', 'transferCourse'],
  ['GET', '/v4/vis/edu/adjustcourse/getTransferCourseRecord.json', 'recruit.AdjustCourseController', 'getTransferCourseRecord'],
  ['POST', '/v4/vis/edu/adjustcourse/getTransferCourseCertificate.json', 'recruit.AdjustCourseController', 'getTransferCourseCertificate'],
  [
    'GET',
    '/v4/vis/recruit/adjustcourse/findPageByWithSpecificCourse.json',
    'recruit.AdjustCourseController',
    'findPageByWithSpecificCourse'
  ]
];
