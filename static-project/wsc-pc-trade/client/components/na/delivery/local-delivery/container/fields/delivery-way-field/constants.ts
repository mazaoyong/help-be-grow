export const BUSINESS_TYPE = {
  1: '食品小吃',
  2: '食品饮料',
  3: '鲜花',
  8: '文印票务',
  9: '商超便利店',
  13: '水果生鲜',
  20: '医药',
  21: '蛋糕',
  24: '酒品',
  26: '服装',
  27: '汽修零配',
  28: '数码',
  5: '其他',
};

export const PARTNER_STATUS = [
  {
    color: '#000',
    type: '未开通',
    disabled: false,
    btnText: '申请开通',
  },
  {
    color: '#000',
    type: '审核中',
    disabled: true,
    btnText: '申请开通',
  },
  {
    color: '#44BB00',
    type: '已开通',
    disabled: false,
    btnText: '关闭服务',
  },
  {
    color: '#FF4444',
    type: '开通失败',
    disabled: false,
    btnText: '申请开通',
  },
  {
    color: '#999',
    type: '已过期',
    disabled: false,
    btnText: '前往续订',
  },
];
