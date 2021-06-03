export const DETAIL_TAB = {
  STUDENT: 'student',
  PANEL: 'panel',
  RECORD: 'record',
  HOMEWORK: 'homework',
};

// 班级状态
export const EDU_CLASS_STATUS = {
  WILL: '1', // 待开班
  ING: '2', // 开班中
  DONE: '3', // 已结班
};

// 班级状态文案
export const EDU_CLASS_STATUS_TEXT = {
  WILL: '待开班', // 待开班
  ING: '开班中', // 开班中
  DONE: '已结班', // 已结班
};

export const PAGE_URL = {
  STUDENT_DETAIL: 'https://www.youzan.com/v4/vis/edu/page/student#/detail/',
  CUSTOMER: 'https://www.youzan.com/v4/scrm/customer/manage#/detail', // 客户跳转链接，请求参数yzUid
  EDUCLASS_DETAIL: 'https://www.youzan.com/v4/vis/edu/page/educlass#/detail/', // eduClassId eduCourseId 拼接上去
};
