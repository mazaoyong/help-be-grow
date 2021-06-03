// 推荐有奖
module.exports = [
  [
    // 页面
    'GET',
    '/v4/vis/pct/page/referral',
    'ump.ReferralController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 活动列表
    'GET',
    '/v4/vis/pct/referral/list.json',
    'ump.ReferralController',
    'getListJson',
  ],
  [
    // 数据列表
    'GET',
    '/v4/vis/pct/referral/effectList.json',
    'ump.ReferralController',
    'getEffectListJson',
  ],
  [
    // 创建活动
    'POST',
    '/v4/vis/pct/referral/active.json',
    'ump.ReferralController',
    'postActiveJson',
  ],
  [
    // 修改活动
    'PUT',
    '/v4/vis/pct/referral/active.json',
    'ump.ReferralController',
    'putActiveJson',
  ],
  [
    // 获取活动详情
    'GET',
    '/v4/vis/pct/referral/active.json',
    'ump.ReferralController',
    'getActiveJson',
  ],
  [
    // 删除活动
    'DELETE',
    '/v4/vis/pct/referral/active.json',
    'ump.ReferralController',
    'deleteActiveJson',
  ],
  [
    // 结束活动
    'PUT',
    '/v4/vis/pct/referral/endActive.json',
    'ump.ReferralController',
    'endActive',
  ],
  [
    // 商品列表
    'GET',
    '/v4/vis/pct/referral/goodsList.json',
    'ump.ReferralController',
    'getGoodsList',
  ],
  [
    // 商品分组
    'GET',
    '/v4/vis/pct/referral/goodsGroupList.json',
    'ump.ReferralController',
    'getGoodsGroupList',
  ],
  [
    // 获取概览数据
    'GET',
    '/v4/vis/pct/referral/getOverview.json',
    'ump.ReferralController',
    'getOverview',
  ],
  [
    // 获取排行数据
    'GET',
    '/v4/vis/pct/referral/findRankDataByPage.json',
    'ump.ReferralController',
    'findRankDataByPage',
  ],
  [
    // 获取被推荐人数据
    'GET',
    '/v4/vis/pct/referral/findDetailDataByPage.json',
    'ump.ReferralController',
    'findDetailDataByPage',
  ],
  [
    // 获取详情
    'GET',
    '/v4/vis/pct/referral/getDetailByActivityId.json',
    'ump.ReferralController',
    'getDetailByActivityId',
  ],
  [
    // 导出活动
    'GET',
    '/v4/vis/pct/referral/exportReferralRewardData.json',
    'ump.ReferralController',
    'exportReferralRewardData',
  ],
];
