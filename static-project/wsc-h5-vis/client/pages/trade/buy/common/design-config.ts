type BuyComponentName =
  // ====代码实际包含的block====
  // 多人拼团头部提示 (多人拼团)
  | 'groupon-explain-block'
  // 优惠套餐信息（优惠套餐）
  | 'package-buy-block'
  // 课程信息
  | 'course-block'
  // 信息采集 (知识付费)
  | 'info-collect-block'
  // 服务信息（线下课）
  | 'service-block'
  // 学员信息（线下课）
  | 'student-block'
  // 上课信息（线下课）
  | 'class-block'
  // 优惠信息
  | 'ump-block'
  // 资产
  | 'assets-block'
  // 购买须知
  | 'buy-tips-block'
  // 底部提交订单
  | 'submit-block'
  // 收银台
  | 'pay-block'
  // ====有赞云特殊block分割线====
  // 有赞云-商品模块
  | 'goods-block';

interface DesignItem {
  type: BuyComponentName;
  customProps?: Object,
}

/**
 * 下单页默认design配置
 */
export const buyDesignList: DesignItem[] = [
  // { type: 'groupon-explain-block' }, //不开放给有赞云配置，通过adapter拼装
  { type: 'goods-block' }, // goods-block 代指下面course-block + package-buy-block
  // { type: 'package-buy-block' },
  // { type: 'course-block' },
  { type: 'info-collect-block' },
  { type: 'service-block' },
  { type: 'student-block' },
  { type: 'class-block' },
  { type: 'ump-block' },
  { type: 'assets-block' },
  { type: 'buy-tips-block' },
  { type: 'submit-block' },
  // { type: 'pay-block' }, //不开放给有赞云配置，通过adapter拼装
];

/**
 * 上云配置适配逻辑，目前下单页组件中包含一些比较细碎的不适合直接开放出去的block配置的项，在此处做一层处理：
 * 1 有赞云配置 goods-block，页面中适配为 package-buy-block + course-block
 * 2 有赞云不开放 groupon-explain-block，页面中适配增加在顶部
 * 3 有赞云不开放 pay-block，页面中适配增加在底部
 *
 * @param {Array}design 有赞云配置
 */
export const designAdapter = function(design:DesignItem[]):DesignItem[] {
  if ((design || []).length === 0) design = buyDesignList;
  let goodsBlockIndex = design.findIndex(item => item.type === 'goods-block');
  if (goodsBlockIndex >= 0) {
    design.splice(goodsBlockIndex, 1,
      { type: 'package-buy-block' },
      { type: 'course-block' },
    );
  }
  return [
    { type: 'groupon-explain-block' },
    ...design,
    { type: 'pay-block' },
  ];
};
