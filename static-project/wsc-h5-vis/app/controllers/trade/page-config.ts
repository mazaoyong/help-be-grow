type BuyComponentName =
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
  | 'pay-block';

interface DesignItem {
  type: BuyComponentName;
  customProps?: Object,
}

/**
 * 下单页模块默认配置
 */
export const buyDesignList: DesignItem[] = [
  { type: 'groupon-explain-block' },
  { type: 'package-buy-block' },
  { type: 'course-block' },
  { type: 'info-collect-block' },
  { type: 'service-block' },
  { type: 'student-block' },
  { type: 'class-block' },
  { type: 'ump-block' },
  { type: 'assets-block' },
  { type: 'buy-tips-block' },
  { type: 'submit-block' },
  { type: 'pay-block' },
];
