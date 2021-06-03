// 学员及资产批量导入相关路由
module.exports = [
  [
    // 创建导入任务
    'POST',
    '/v4/vis/edu/studentImport/create.json',
    'student.ImportController',
    'createImportTask',
  ],
  [
    // 获取导入列表
    'GET',
    '/v4/vis/edu/studentImport/findByPage.json',
    'student.ImportController',
    'findImportTaskByPage',
  ],
  [
    // 导入列表刷新
    'GET',
    '/v4/vis/edu/studentImport/getImportTask.json',
    'student.ImportController',
    'getImportTask',
  ],
  [
    // page 路由
    'GET',
    ['/v4/vis/edu/page/studentImport', '/v4/vis/edu/page/stuImport'],
    'student.ImportController',
    'getIndexHtml',
  ],
  [
    // 查询单店员工
    'GET',
    ['/v4/vis/student/single-staff/find.json'],
    'student.ImportController',
    'getSingleShopStaffList',
  ],
  [
    // 查询连锁员工
    'GET',
    ['/v4/vis/staff/queryPage.json'],
    'student.ImportController',
    'getChainStaffList',
  ],
  [
    // 分页查询导入行信息
    'GET',
    '/v4/vis/edu/studentImport/findRowsByPage.json',
    'student.ImportController',
    'findRowsByPage',
  ],
  [
    // 获取导入学员的任务行
    'GET',
    '/v4/vis/edu/studentImport/getRowById.json',
    'student.ImportController',
    'getRowById',
  ],
  [
    // 获取导入学员任务行（脱敏）
    'GET',
    '/v4/vis/edu/studentImport/findRowsDesensitizeByPage.json',
    'student.ImportController',
    'findRowsDesensitizeByPage',
  ],
  [
    // 修改/新增导入学员任务行数据
    'POST',
    '/v4/vis/edu/studentImport/saveRow.json',
    'student.ImportController',
    'saveRow',
  ],
  [
    // 批量修改导入行字段
    'POST',
    '/v4/vis/edu/studentImport/batchUpdateFields.json',
    'student.ImportController',
    'batchUpdateFields',
  ],
  [
    // 批量删除导入行
    'POST',
    '/v4/vis/edu/studentImport/batchDeleteRows.json',
    'student.ImportController',
    'batchDeleteRows',
  ],
  [
    // 获取导入任务总览
    'GET',
    '/v4/vis/edu/studentImport/getValidateSummary.json',
    'student.ImportController',
    'getValidateSummary',
  ],
  [
    // 准备导入前数据校验
    'POST',
    '/v4/vis/edu/studentImport/prepareImport.json',
    'student.ImportController',
    'prepareImport',
  ],
  [
    // 开始导入
    'POST',
    '/v4/vis/edu/studentImport/submitImport.json',
    'student.ImportController',
    'submitImport',
  ],
  [
    // 获取导入/校验任务进度
    'GET',
    '/v4/vis/edu/studentImport/findTaskProgress.json',
    'student.ImportController',
    'findTaskProgress',
  ],
  [
    // 获取单个导入任务详情
    'GET',
    '/v4/vis/edu/studentImport/getByTaskId.json',
    'student.ImportController',
    'getByTaskId',
  ],
  [
    // 重新导入数据
    'POST',
    '/v4/vis/edu/studentImport/prepareReimport.json',
    'student.ImportController',
    'prepareReimport',
  ],
  [
    // 获取错误任务行校验
    'GET',
    '/v4/vis/edu/studentImport/listRowFieldErrorSummary.json',
    'student.ImportController',
    'listRowFieldErrorSummary',
  ],
  [
    // 获取导入任务重复行
    'GET',
    '/v4/vis/edu/studentImport/findSameRows.json',
    'student.ImportController',
    'findSameRows',
  ],
  [
    // 获取导入任务冲突行
    'GET',
    '/v4/vis/edu/studentImport/getSameData.json',
    'student.ImportController',
    'getSameData',
  ],
  [
    // 获取导入模板
    'GET',
    '/v4/vis/edu/studentImport/getTemplate.json',
    'student.ImportController',
    'getTemplate',
  ],
  [
    // 获取导入记录的资料项
    'GET',
    '/v4/vis/edu/studentImport/getHeader.json',
    'student.ImportController',
    'getHeader',
  ],
  [
    // 获取导入学员基本信息可批量修改的资料项
    'GET',
    '/v4/vis/edu/studentImport/getSpecifiedHeader.json',
    'student.ImportController',
    'getSpecifiedHeader',
  ],
  [
    // 获取模板检测资料项变更结果
    'GET',
    '/v4/vis/edu/studentImport/templateCheck.json',
    'student.ImportController',
    'templateCheck',
  ],
  [
    // 通过任务ID检测模板是否变更
    'GET',
    '/v4/vis/edu/studentImport/templateCheckByTaskId.json',
    'student.ImportController',
    'templateCheckByTaskId',
  ],
  [
    // 重新校验数据
    'GET',
    '/v4/vis/edu/studentImport/againValidate.json',
    'student.ImportController',
    'againValidate',
  ],
];
