module.exports = [
  [
    // 知识付费下内容和专栏的 隐藏/显示
    'PUT',
    '/v4/vis/pct/biz/hideOwl.json',
    'course.PctManageController',
    'hideOwl',
  ],
  [
    // 对知识付费下内容,直播,专栏,专栏下的内容,专栏下的直播进行排序
    'PUT',
    '/v4/vis/pct/biz/sortOwl.json',
    'course.PctManageController',
    'sortOwl',
  ],
  [
    // 专栏下添加内容
    'POST',
    '/v4/vis/pct/biz/columnContent.json',
    'course.PctManageController',
    'postColumnContentJson',
  ],
  [
    'POST',
    '/v4/vis/pct/biz/batchContent.json',
    'course.PctManageController',
    'postBatchContentJson',
  ],
  [
    'PUT',
    '/v4/vis/pct/biz/stopColumn.json',
    'course.PctManageController',
    'stopUpdateColumn',
  ],
  [
    // 查询wsc码
    'GET',
    '/v4/vis/pct/biz/getWscQrcode.json',
    'course.PctManageController',
    'getWscQrCode',
  ],
];
