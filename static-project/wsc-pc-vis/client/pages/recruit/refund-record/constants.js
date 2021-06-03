// 退课类型
export const REFUNDTYPE = {
  // 按课时
  BY_COURSE: 1,
  // 按时间段
  BY_TIMEPERIOD: 2,
  // 按期
  BY_PHASE: 3,
  // 自定义
  BY_CUSTOM: 0,
};

// 所有标记支付类型
export const MARK_PAY_ALL_TYPES = [
  // 标记收款-自有微信支付
  'MARK_PAY_WXPAY',
  // 标记收款-自有支付宝
  'MARK_PAY_ALIPAY',
  // 标记收款-自有POS刷卡
  'MARK_PAY_POS',
  // 标记收款-自定义
  'MARK_PAY_DIY',
];
