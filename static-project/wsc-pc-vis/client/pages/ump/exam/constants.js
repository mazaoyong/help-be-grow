// 状态码所对应的 name
export const activityStatusName = {
  3: '已结束',
  2: '进行中',
  1: '未开始',
  0: '所有',
};

// 视频转码状态码所对应的 name
export const activityVideoStatusName = {
  0: '草稿',
  1: '可用',
  2: '转码/审核中',
  3: '转码/审核失败',
};

// 状态所对应的状态码
export const ACTIVITY_STATUS = {
  OPEN: 2,
  END: 3,
  UNDO: 1,
  ALL: 0,
};

// 列表页视频审核状态对应的状态码
export const ACTIVITY_VIDEO_STATUS = {
  DRAFT: 0,
  ENABLED: 1,
  UNDERREVIEW: 2,
  FAIL: 3,
};

// 题目设置页视频审核对应的状态
export const TITLE_VIDEO_STATUS = {
  UNKNOW: -1,
  UPLOAD_SUCCESS: 1,
  TRANSCODING_SUCCESS: 2,
  TRANSCODING_FAIL: 3,
  VERIFY_SUCCESS: 4,
  VERIFY_WAIT: 5,
  VERIFY_FAIL: 6,
};

// tab 所需字段
export const TAB_DATA = [
  { title: '所有活动', key: ACTIVITY_STATUS.ALL + '' },
  { title: '未开始', key: ACTIVITY_STATUS.UNDO + '' },
  { title: '进行中', key: ACTIVITY_STATUS.OPEN + '' },
  { title: '已结束', key: ACTIVITY_STATUS.END + '' },
];

export const ZERO_PLACEHOLDER = '- -';

export const SETTING_STEPS = {
  1: 'BasisSetting',
  2: 'TitleSetting',
  3: 'ResultSetting',
  4: 'FinishSetting',
};

export const BASIS_FORM_DATA = {
  style: 1, // 落地页形式 1固定 2自定义
  title: '', // 标题
  coverPic: {
    url: '',
    width: 0,
    height: 0,
  },
  questionBackgroundPic: {
    url: '',
    width: 0,
    height: 0,
  }, // 题目背景
  summary: '',
  endAt: 0,
  startAt: 0,
  applicableCampusList: [],
  applicableCampusType: 1,
  backgroundPic: {
    url: '',
    width: 0,
    height: 0,
  }, // 自定义 页面图
  startMenuPic: {
    url: '',
    width: 0,
    height: 0,
  }, // 自定义 开始按钮
  nextQuestionMenuPic: {
    url: '',
    width: 0,
    height: 0,
  }, // 自定义 下一步图
};

export const TITLE_FORM_ITEM_DATA = {
  detail: '', // 选项详情
  id: 0, // 选项 id
  itemPic: {
    url: '',
    width: 0,
    height: 0,
  }, // 图片
  questionId: 0, // 所属的问题 id
  scoreType: 1, // 分数类型 1计数 2分数
  style: 1, // 1文本 2图片
  score: -1, // 分数 -1 1
};

export const TITLE_FORM_DATA = {
  examId: 0, // 测试 id
  id: 0, // 题目 id
  backgroundPic: {
    height: 0,
    width: 0,
    url: '',
  }, // 题目背景
  mediaType: 0, // 题目类型 0文本 1图片 2视频 3音频
  description: '', // 题目文字
  media: {
    descUrl: '', // 图片 音频的链接
    height: '', // 图片高
    width: '', // 图片宽
    mediaSize: '', // 多媒体的大小
    mediaName: '', // 多媒体的名字
    videoId: '', // 视频的 id
  },
  itemRowNum: 1, // 选项1行1个 1行2个
  questionType: 1, // 默认单选
  scoreType: 1, // 1计数 2分数
  itemList: [TITLE_FORM_ITEM_DATA, TITLE_FORM_ITEM_DATA],
};

export const RESULT_FORM_DATA = {
  coupon: {
    couponId: 0,
    description: '',
    examId: 0,
    giveCount: 1,
    id: 0,
    resultId: 0,
  }, // 优惠券信息
  conditions: '{"lowPoint":0,"highPoint":0,"new":1}', // 判断条件
  display: 1, // c 端是否隐藏结果 1显示 0隐藏
  descPic: {
    height: 0,
    width: 0,
    url: '',
  }, // 结果图片
  description: '', // 结果描述
  examId: 0, // 测试id
  id: 0, // 测试结果 id
  flag: 0, // 是否为删除
  kdtId: 0,
  pushType: 1, // 关联推送类型
  resultType: 1, // 结果类型
  style: 1, // 结果样式 1文本 2 图片
  title: '', // 测试结果
};

export const FINISH_FORM_DATA = {
  shareUrl: '', // 二维码链接
  title: '', // 标题
  id: 0,
  description: '', // 描述
  examId: 0,
  shareType: 2, // 进入测试的类型 1:关注公众号,2:进入测试页
  style: 0, // 分享的样式
};

// 选项的最大/小先知数量
export const MAX_TITLE_ITEMS = 12;
export const MIN_TITLE_ITEMS = 2;

// 列表页的时间转换格式
export const LIST_TIME_FORMAT = 'YYYY-MM-DD';

export const DEFAULT_RECORD = {
  correctNum: 0,
  errorNum: 0,
  examRecordId: 0,
  examTime: '2019-10-10 12:34:00',
  userInfo: {
    anonymity: false,
    avatar: '',
    mobile: '',
    nickName: '匿名用户',
    userId: 0,
  },
};
