const routePrefix = '/v4/vis/h5/edu-admin/schedule';
const controllerPath = 'h5.edu-admin.ScheduleController';

module.exports = [
  ['GET', `${routePrefix}/getBatchSignInResult.json`, controllerPath, 'getBatchSignInResult'],
  ['GET', `${routePrefix}/getSignInResult.json`, controllerPath, 'getSignInResult'],
  ['POST', `${routePrefix}/businessBatchSignInV2.json`, controllerPath, 'businessBatchSignInV2'],
  ['GET', `${routePrefix}/getSignInTip.json`, controllerPath, 'getSignInTip'],
  ['GET', `${routePrefix}/getBatchSignInTip.json`, controllerPath, 'getBatchSignInTip'],
  ['POST', `${routePrefix}/batchCancel.json`, controllerPath, 'batchCancel'],
  ['GET', `${routePrefix}/findLockedPage.json`, controllerPath, 'findLockedPage'],
  ['GET', `${routePrefix}/findLittlePage.json`, controllerPath, 'findLittlePage'],
  [
    // 获取老师助教列表（带冲突检测）
    'GET',
    `${routePrefix}/getTeacherList.json`,
    controllerPath,
    'getTeacherWithConflictJson',
  ],
  [
    // 获取上课门店列表
    'GET',
    `${routePrefix}/getClassStore.json`,
    controllerPath,
    'getClassStoreJson',
  ],
  [
    // 获取教室列表（带冲突检测）
    'GET',
    `${routePrefix}/getClassroom.json`,
    controllerPath,
    'getClassroomWithConflictJson',
  ],
  [
    // 提交创建排课信息之前检测冲突
    'POST',
    `${routePrefix}/validateBeforeModify.json`,
    controllerPath,
    'validateBeforeSaveOrModify',
  ],
  [
    // 创建排课
    'POST',
    `${routePrefix}/create.json`,
    controllerPath,
    'createSchedule',
  ],
  // 获取全部校区
  [
    'GET',
    `${routePrefix}/findPageAllCampus.json`,
    controllerPath,
    'findPageAllCampus',
  ],
  [
    // 轮询新建/编辑排课的结果
    'GET',
    `${routePrefix}/getActionResult.json`,
    controllerPath,
    'getActionResult',
  ],
  [
    // 班级列表
    'GET',
    `${routePrefix}/getCourseList.json`,
    controllerPath,
    'getCourseList',
  ],
  [
    // 日程列表
    'GET',
    `${routePrefix}/getLessons.json`,
    controllerPath,
    'getLessons',
  ],
  [
    // 日程日历列表
    'GET',
    `${routePrefix}/getDays.json`,
    controllerPath,
    'getDays',
  ],
];
