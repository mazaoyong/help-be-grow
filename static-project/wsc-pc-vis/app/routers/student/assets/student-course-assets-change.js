module.exports = [
  [
    'GET',
    '/v4/vis/student/assets/student-course-assets-change/queryAssetOperationBriefInfo.json',
    'student.assets.StudentCourseAssetsChangeController',
    'getQueryAssetOperationBriefInfoJson',
  ],
  [
    'GET',
    '/v4/vis/student/assets/student-course-assets-change/queryAssetOperationPage.json',
    'student.assets.StudentCourseAssetsChangeController',
    'getQueryAssetOperationPageJson',
  ],
  [
    'GET',
    '/v4/vis/student/assets/student-course-assets-change/getAssetCourseTimeUpdateInfo.json',
    'student.assets.StudentCourseAssetsChangeController',
    'getGetAssetCourseTimeUpdateInfoJson',
  ],
  [
    'GET',
    '/v4/vis/student/assets/student-course-assets-change/getAssetClassUpdateInfo.json',
    'student.assets.StudentCourseAssetsChangeController',
    'getGetAssetClassUpdateInfoJson',
  ],
  [
    'POST',
    '/v4/vis/student/assets/student-course-assets-change/getStuAssetInfo.json',
    'student.assets.StudentCourseAssetsChangeController',
    'getStuAssetInfo',
  ],
];
