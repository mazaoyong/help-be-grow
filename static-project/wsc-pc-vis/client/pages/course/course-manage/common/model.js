// import { isNullOrUndefined } from "util";
// import { isJSDocNullableType } from "typescript";

/**
 * 数据中心
 */
let commonData = {
  /* ---- 课程模块折叠 ---- */
  // 基本信息折叠
  basicInfoExtra: 1,
  // 价格及售卖信息折叠
  priceInfoExtra: 1,
  // 课程详情信息折叠
  detailInfoExtra: 1,
  // 其他信息折叠
  otherInfoExtra: 1,
  // 基本信息中子信息折叠
  basicChildInfoExtra: 0,

  /* ---- 课程基本信息 ---- */
  // 课程名称
  title: '',
  // 课程图片
  pictures: [],
  // 课程视频
  videoId: 0,
  videoModel: {},
  // 分享描述
  subTitle: '',
  // 分销员海报
  distributorPics: [],
  // 课程分组
  groups: [],
  // 课程标签
  tagList: [],
  beginTime: [null, null],
  // 开课时间
  courseStartAt: null,
  // 上课结束时间
  courseEndAt: null,
  // 课程卖点
  sellPoint: '',
  // 是否为售卖方式为自定义的编辑页面
  isFromCustomer: false,
  // 是否是老数据
  isFromOldCustomer: false,
  /* ---- 价格及售卖信息 ---- */
  // 销售类型, 0: 体验课, 1：正式课
  courseType: 0,
  // 课程销售类型, 1:按课时, 2:按时段, 3:自定义
  courseSellType: 1,
  // 课程有效时间, 1:永久有效, 2:自生效日期X天有效
  validityPeriodType: 1,
  validityPeriod: {
    // 有效时间数量
    range: '',
    // 有效时间单位
    unit: 1,
  },
  // 课程生效时间, 1:首次签到后生效, 2:购买后X天后生效，3:立即生效
  courseEffectiveType: 3,
  //  购买后延迟生效时间
  courseEffectiveDelayDays: '',
  // 适用课程类型, 2:指定课程, 1:全部课程
  // applyCourseType: 2,
  // // 教务课程信息
  // eduCourse: {
  //   id: null,
  //   name: '',
  //   classRelatedInfo: null,
  // },
  // 使用课程复合数据：包含是否关联课程，制定课程，选择课程
  applyCourse: {
    // 适用课程类型, 2:指定课程, 1:全部课程
    applyCourseType: 2,
    // 教务课程信息
    eduCourse: {
      id: null,
      name: '',
      classRelatedInfo: null,
    },
    // 是否启用适用课程
    isRelatedEduCourse: true,
  },
  // 推广码
  joinGroupSetting: {
    buttonCopy: '立即添加',
    codeType: 1,
    liveQRValue: {
      codeId: null,
      codePicture: '',
      codeName: '',
      codeKdtId: null,
    },
    normalQRValue: '',
    createdAt: '',
    groupOpen: 0,
    courseHomepageOpen: 0,
    enrollmentSussessPageOpen: 1,
    guideCopy: '及时了解课程动向',
    guideTitle: '添加老师微信',
    updatedAt: '',
  },
  // 课程规格/库存
  sku: [],
  // 库存信息
  stocks: [],
  // 不同售卖方式库存信息
  sellStocks: [],
  // 价格
  price: '',
  // 划线价
  origin: '',
  // 名额
  totalStock: 0,
  // 是否参与会员折扣，默认不参与
  joinLevelDiscount: 0,

  /* ---- 课程详情 ---- */
  // 上课老师isNullOrUndefined
  // 服务类型
  servicePledge: 0,
  teacherList: [],
  // 适用对象
  applyUser: '',
  // 目录列表
  directoryList: [],
  // 目录是否被修改
  changeDirectory: false,
  // 目录对象
  directory: {
    changeDirectory: false,
    directoryList: [],
  },
  // 上课地点
  addressList: [],
  // 课程详情
  intro: '',
  // 开售方式
  publishStatus: 1,
  // 定时开售时间
  timingPublishAt: null,
  // 购买按钮自定义
  courseBuyButton: {
    buyBtnConfig: 0,
    // buyBtnLabel: '立即报名',
  },
  // 用户限购
  quota: null,
  // 意向上课时间
  intentTime: 0,
  // 意向上课地点
  intentAddress: 0,
  registerInfo: [],
  buyNotice: '',
  // 连锁校区是否有权限
  isStockIndependent: true,
  // 课程详情页隐藏剩余名额
  hideStock: 0,
};

export default {
  // 更新数据
  set(newData = {}) {
    commonData = { ...commonData, ...newData };
  },

  get(key) {
    return key ? commonData[key] : commonData;
  },
};
