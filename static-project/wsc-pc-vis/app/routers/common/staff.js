module.exports = [
  [
    // 查询连锁员工
    'GET',
    '/v4/vis/common/staff/getChainStaffList.json',
    'common.StaffController',
    'getChainStaffList',
  ],
  [
    // 查询单店员工
    'GET',
    '/v4/vis/common/staff/getSingleShopStaffList.json',
    'common.StaffController',
    'getSingleShopStaffList',
  ],
];
