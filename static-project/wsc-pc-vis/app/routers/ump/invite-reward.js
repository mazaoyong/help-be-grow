module.exports = [
  // 后台页面
  ['GET', '/v4/vis/ump/invite-reward', 'ump.InviteRewardController', ['getIndexHtml']],
  // 创建教育转介绍活动
  [
    'POST',
    '/v4/vis/ump/invite-reward/_textarea_/create.json',
    'ump.InviteRewardController',
    'create',
  ],
  // 校验时间范围内是否存在活动
  [
    'POST',
    '/v4/vis/ump/invite-reward/checkTimeRange.json',
    'ump.InviteRewardController',
    'checkTimeRange',
  ],
  // 编辑教育转介绍活动
  ['POST', '/v4/vis/ump/invite-reward/_textarea_/edit.json', 'ump.InviteRewardController', 'edit'],
  // 转介绍活动列表查询
  ['GET', '/v4/vis/ump/invite-reward/findByPage.json', 'ump.InviteRewardController', 'findByPage'],
  // 转介绍活动详情查询
  ['GET', '/v4/vis/ump/invite-reward/getDetail.json', 'ump.InviteRewardController', 'getDetail'],
  // 失效教育转介绍活动
  ['POST', '/v4/vis/ump/invite-reward/invalid.json', 'ump.InviteRewardController', 'invalid'],
  // 删除教育转介绍活动
  ['POST', '/v4/vis/ump/invite-reward/delete.json', 'ump.InviteRewardController', 'delete'],
  // 查询转介绍活动效果数据(活动维度)
  [
    'GET',
    '/v4/vis/ump/invite-reward/findPromotionList.json',
    'ump.InviteRewardController',
    'findPromotionList',
  ],
  // 查询转介绍活动新学员效果数据
  [
    'GET',
    '/v4/vis/ump/invite-reward/findNewStudentList.json',
    'ump.InviteRewardController',
    'findNewStudentList',
  ],
  // 获取h5二维码
  [
    'GET',
    '/v4/vis/ump/invite-reward/createQrCode.json',
    'ump.InviteRewardController',
    'createQrCode',
  ],
  // 导出新学员列表
  [
    'POST',
    '/v4/vis/ump/invite-reward/exportNewStudentData.json',
    'ump.InviteRewardController',
    'exportNewStudentData',
  ],
  // 获取活动数据
  ['GET', '/v4/vis/ump/invite-reward/getSummary.json', 'ump.InviteRewardController', 'getSummary'],
];
