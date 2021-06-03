module.exports = [
  // 学员资料页
  ['GET', '/v4/vis/edu/settings/student-profile', 'recruit.StudentProfileController', 'getIndexHtml'],
  // 获取添加的学员资料项列表
  [
    'GET',
    '/v4/vis/edu/profile/added-list.json',
    'recruit.StudentProfileController',
    'getProfileItemList',
  ],
  // 添加门店的学员资料项列表
  [
    'POST',
    '/v4/vis/edu/profile/add-items.json',
    'recruit.StudentProfileController',
    'addProfileItems',
  ],
  // 获取所有的学员资料项列表
  [
    'GET',
    '/v4/vis/edu/profile/all-items.json',
    'recruit.StudentProfileController',
    'getAllProfileItemsJSON',
  ],
  // 创建学员资料项
  [
    'POST',
    '/v4/vis/edu/profile/create.json',
    'recruit.StudentProfileController',
    'createStudentProfileJSON',
  ],
  // 更新学员资料项
  [
    'PUT',
    '/v4/vis/edu/profile/update.json',
    'recruit.StudentProfileController',
    'updateStudentProfileJSON',
  ],
  // 删除学员资料项
  [
    'DELETE',
    '/v4/vis/edu/profile/delete.json',
    'recruit.StudentProfileController',
    'deleteStudentProfileJSON',
  ],
  // 根据场景获取资料项列表
  [
    'GET',
    '/v4/vis/edu/profile/list-by-scene.json',
    'recruit.StudentProfileController',
    'getListByApplicableScene',
  ],
  // 从apollo获取配置信息
  [
    'GET',
    '/v4/vis/edu/profile/get-remote-conf.json',
    'recruit.StudentProfileController',
    'getRemoteConfJSON',
  ],
];
