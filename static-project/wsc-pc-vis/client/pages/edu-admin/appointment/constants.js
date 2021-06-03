import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';

import { chainSupportSingle } from './chain';
// 预约状态 1 待确认 2 待上课 3 已上课 4 已取消
export const RESERVE_STATUS = {
  NOT_CONFIRMED: 1,
  NOT_CLASS: 2,
  CLASSED: 3,
  CALCELED: 4,
};

export const RESERVE_STATUS_TEXT = [
  {
    text: '待确认',
    status: 1,
  },
  {
    text: '待上课',
    status: 2,
  },
  {
    text: '已上课',
    status: 4,
  },
  {
    text: '已取消',
    status: 5,
  },
];

export const RESERVE_STATUS_MAP = {
  1: '待确认',
  2: '待上课',
  4: '已签到',
  6: '未到',
  7: '请假',
  5: '已取消',
};

// 课程类型： 0：体验课 1：正式课 2：全部
export const COURSE_TYPE = {
  0: '体验课',
  1: '正式课',
  2: '全部',
};

export const RESERVE_SOURCE = {
  2: '线上预约',
  3: '手动录入',
  4: '线上预约',
};

// 课程预约来源
export const RESERVE_ORIGIN = [
  {
    value: '',
    text: '全部',
  },
  {
    value: 2,
    text: '线上预约',
  },
  {
    value: 3,
    text: '手动录入',
  },
];

export const COURSE_TYPE_OPTION = [
  {
    value: '',
    text: '全部',
  },
  {
    value: '0',
    text: '体验课',
  },
  {
    value: 1,
    text: '正式课',
  },
];

export const RESERVE_DIALOG_NAME = 'reserve-dialog';
export const SERVICE_DIALOG_NAME = 'service-dialog';

export const PAGE_URL_MAP = {
  createTeacherPage: chainSupportSingle ? 'https://www.youzan.com/v2/staff/index/index#/create' : 'https://www.youzan.com/v4/setting/chainstaff#/staff/add?roleId=21', // 创建老师角色
  createStorePage: 'https://www.youzan.com/v2/setting/store#physical_store', // 创建店铺
  exportDataPage: getExportRecordUrl({ type: EXPORT_RECORD_TYPES.APPOINTMENT_LIST }), // 导出记录页面
  studentPage: 'https://www.youzan.com/v4/scrm/customer/manage#/student/detail/', // 学员详情页面，直接拼接alias，不是请求参数
  customerPage: 'https://www.youzan.com/v4/scrm/customer/manage#/detail', // 客户跳转链接，请求参数yzUid
  serviceDetail: 'https://h5.youzan.com/wscvis/edu/prod-detail', // 服务内容详情，需要携带这两个参数 ?alias=2fxp8kyyt7dzj&kdt_id=491391
  remindPage: 'https://www.youzan.com/v4/message/messagepush#/setting/AppointmentSucessRemind', // 预约提醒设置
  coursePage: 'https://h5.youzan.com/wscvis/edu/course/coursedetail', // 线下课详情 ?assetNo=A1628673467744256
  studentDetail: 'https://www.youzan.com/v4/vis/edu/page/student#/detail/', // 学员详情
};

export const TAB_INDEX = {
  LIST: '0',
  PANEL: '1',
};

export const APPOINTMENT_SCHEDULE_TYPE = {
  DAY: 'day',
  WEEK: 'week',
};

export const APPOINTMENT_STATUS_TYPE = {
  TO_BE_CONFIRMED: 1, // 待确认
  TO_BE_PERFORMED: 2, // 待上课

  /* 以下属于 已上课 */
  COMPLETED: 4, // 已完成
  ABSENCE: 6, // 已缺席
  ASK_FOR_LEAVED: 7, // 已请假
  /* 以上属于 已上课 */

  CANCELLED: 5, // 已取消
};

export const SCHEDULE_INTERVAL = {
  QUARTER: 15, // 15分钟
  HALF: 30, // 30分钟
  HOUR: 60, // 60分钟
};
