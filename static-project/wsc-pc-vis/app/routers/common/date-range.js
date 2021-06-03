// 时间段
module.exports = [
  [
    // 创建
    'POST',
    '/v4/vis/daterange/create.json',
    'common.DateRangeController',
    'create',
  ],
  [
    // 查询
    'GET',
    '/v4/vis/daterange/findByKdtId.json',
    'common.DateRangeController',
    'findByKdtId',
  ],
  [
    // 更新
    'PUT',
    '/v4/vis/daterange/update.json',
    'common.DateRangeController',
    'update',
  ],
  [
    // 删除
    'DELETE',
    '/v4/vis/daterange/delete.json',
    'common.DateRangeController',
    'delete',
  ],
];
