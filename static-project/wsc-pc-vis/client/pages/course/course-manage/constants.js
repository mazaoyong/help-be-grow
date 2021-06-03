export const PUBLISH_STATUS = {
  PUBLISH_NOW: 1,
  PUBLISH_TIME: 2,
  UNPUBLISH: 3,
};

export const REGISTERITEM = ['intentTime', 'intentAddress'];

export const DEMO_IMG = {
  SERVICE: 'https://b.yzcdn.cn/public_files/2018/11/07/service.png',
  FREE: 'https://b.yzcdn.cn/public_files/2018/12/11/free.png',
  TAG: 'https://b.yzcdn.cn/public_files/2018/11/07/tag-demo.png',
  TEACHER: 'https://b.yzcdn.cn/public_files/2018/11/06/teacher-demo.png',
  GROUPON: [
    'https://b.yzcdn.cn/public_files/624e07978b69ca3ae5748e74f834a780.png',
    'https://b.yzcdn.cn/public_files/60b5e8cb573db70f6abbf7caa47b9498.png',
  ],
  COURSE_PAGE: 'https://b.yzcdn.cn/public_files/2019/10/09/ce0d72d455762b0bbb071c8915312625.png',
  ORDER: 'https://b.yzcdn.cn/public_files/e3b862645b95fcfeb0a35231123fb7ba.png',
};

export const LOCK_PICTURE = 'https://b.yzcdn.cn/public_files/2019/06/11/lock.png';

export const DEMO_TEXT = {
  SERVICE: '二次确认在课程详情页显示示例：',
  FREE: '免预约在课程详情页显示示例：',
  TAG: '课程标签在课程详情页显示示例：',
  TEACHER: '主讲老师在课程详情页显示示例：',
  GROUPON: '加粉推广在页面中的示例',
  ORDER: '自定义报名按钮在页面中的示例',
};

// 线下课售卖方式
export const COURSE_SELL_GROUP = ['按课时', '按时段', '按期', '自定义'];
export const COURSE_SELL_TYPE_TIPS = [
  '适合按上课次数销售的场景',
  '适合月卡、季度卡、年卡销售的场景',
  '适合春季班，秋季班，暑假班，寒假班等按期销售的场景',
  '用户购买后，默认课程不生效，需在学员详情修改有效期才能排课。',
];

// 线下课不同售卖方式SKU表头
export const COURSE_SELL_BY_CLASSTIME = ['名称', '*课时', '*价格（元）', '*名额（人）'];
export const COURSE_SELL_BY_TIME = ['名称', '*时段', '*价格（元）', '*名额（人）'];
export const COURSE_SELL_BY_TERM = ['名称', '*班级（学员报名后自动被分配到本班）', '*价格（元）', '*名额（人）'];

// 线下课生效时间单位
export const TIME_LIST = ['天', '月', '季', '年'];

// 线下课不同售卖方式kId
export const COURSE_SKU_LIST = {
  COURSETIME: 4849986,
  TIMERANGE: 468181,
  CLASSNAME: 5038178,
};

// 不同售卖方式
export const SELL_STATUS = ['出售中', '已售罄', '已停售'];

export const SHOP_LIFECYCLE_STATUS = {
  try: '试用期',
  valid: '服务期',
  protect: '保护期',
  pause: '歇业',
  close: '打烊',
  delete: '删除',
  prepare: '准备期',
  invalid: '无效',
};
