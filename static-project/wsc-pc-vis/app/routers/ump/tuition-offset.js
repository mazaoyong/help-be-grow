module.exports = [
  [
    'GET',
    '/v4/vis/ump/tuition-offset',
    'ump.TuitionOffsetController',
    ['initVisPage', 'getIndexHtml'],
  ],
  // 获取h5店铺二维码
  [
    'GET',
    '/v4/vis/ump/tuition-offset/getWapQrCode.json',
    'ump.TuitionOffsetController',
    'getWapQrCode',
  ],
  /*
    列表页
  */
  // 分页查询列表页信息
  [
    'GET',
    '/v4/vis/ump/tuition-offset/list/findByPage.json',
    'ump.TuitionOffsetController',
    'findTuitionOffsetEventByPage',
  ],
  // 使某一活动失效
  [
    'PUT',
    '/v4/vis/ump/tuition-offset/list/invalid.json',
    'ump.TuitionOffsetController',
    'expireTuitionOffsetEventById',
  ],
  // 删除某活动
  [
    'DELETE',
    '/v4/vis/ump/tuition-offset/list/delete.json',
    'ump.TuitionOffsetController',
    'deleteTuitionOffsetEventById',
  ],
  /*
    新建/编辑页
  */
  // 查询所选时间段内是否有正在进行中的相同类型活动
  [
    'GET',
    '/v4/vis/ump/tuition-offset/edit/checkExistActivity.json',
    'ump.TuitionOffsetController',
    'checkExistActivity',
  ],
  // 查询
  [
    'GET',
    '/v4/vis/ump/tuition-offset/edit/getDetailById.json',
    'ump.TuitionOffsetController',
    'getTuitionOffsetDetailById',
  ],
  // 创建
  [
    'POST',
    '/v4/vis/ump/tuition-offset/edit/create.json',
    'ump.TuitionOffsetController',
    'create',
  ],
  // 编辑
  [
    'POST',
    '/v4/vis/ump/tuition-offset/edit/edit.json',
    'ump.TuitionOffsetController',
    'edit',
  ],
  // 根据goodsIdList查询商品列表信息
  [
    'POST',
    '/v4/vis/ump/tuition-offset/edit/findProductsWithSku.json',
    'ump.TuitionOffsetController',
    'findProductsWithSku',
  ],
  /*
    数据统计页
  */
  // 获取活动统计数据基本信息
  [
    'GET',
    '/v4/vis/ump/tuition-offset/stats/getSimpleActivity.json',
    'ump.TuitionOffsetController',
    'getTuitionOffsetBaseStats',
  ],
  // 活动概要查询
  [
    'GET',
    '/v4/vis/ump/tuition-offset/stats/getBrief.json',
    'ump.TuitionOffsetController',
    'getTuitionOffsetStatsById',
  ],
  // 查看裂变效果排行
  [
    'GET',
    '/v4/vis/ump/tuition-offset/stats/getRankList.json',
    'ump.TuitionOffsetController',
    'getTuitionOffsetEffectRankListByPage',
  ],
  // 参与人明细查看
  [
    'GET',
    '/v4/vis/ump/tuition-offset/stats/getRewardList.json',
    'ump.TuitionOffsetController',
    'getTuitionOffsetParticipantByPage',
  ],
  // 导出裂变效果列表
  [
    'POST',
    '/v4/vis/ump/tuition-offset/stats/exportRewardList.json',
    'ump.TuitionOffsetController',
    'exportRewardList',
  ],
];
