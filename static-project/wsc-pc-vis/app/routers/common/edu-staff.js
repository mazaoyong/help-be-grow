module.exports = [
  [
    // 全量获取某角色下的雇员列
    'GET',
    '/v4/vis/commom/edu/findStaffByRoles.json',
    'common.EduStaffController',
    'findStaffByRoles',
  ],
  [
    // 全量获取某角色下的雇员列
    'GET',
    '/v4/vis/commom/edu/findPagePowerStaffs.json',
    'common.EduStaffController',
    'findPagePowerStaffs',
  ],
  [
    // 全量获取某角色下的雇员列
    'GET',
    '/v4/vis/commom/edu/findAllStaffs.json',
    'common.EduStaffController',
    'findAllStaffs',
  ],
];
