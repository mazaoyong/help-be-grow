
import filterArray from '../../utils/filter-array';

// 动态记录类型
export const RecordTypeOptions = [
  {
    recordType: 0,
    text: '全部状态',
  },
  {
    recordType: 2,
    text: '更新基本资料',
  },
  {
    recordType: 6,
    text: '添加跟进记录',
  },
  {
    recordType: 3,
    text: '更新阶段',
  },
  {
    recordType: 4,
    text: '更新标签',
  },
  {
    recordType: 1,
    text: '添加线索',
  },
  {
    recordType: 5,
    text: '变更课程顾问',
  },
  {
    recordType: 100,
    text: '更新来源',
  },
  {
    recordType: 101,
    text: '变更角色',
  },
];

/**
 * 线索阶段
 * (0,默认态),
 * (1,待分配),
 * (2,待跟进),
 * (3,待邀约),
 * (4,待试听),
 * (5,已试听),
 * (6,已成交),
 * (7,放弃线索),
 * (8,删除),
 */
export const phases = filterArray([
  {
    type: 2,
    text: '待跟进',
  },
  {
    type: 3,
    text: '待邀约',
  },
  {
    type: 4,
    text: '待试听',
    eduOnly: true,
  },
  {
    type: 5,
    text: '已试听',
    eduOnly: true,
  },
  {
    type: 6,
    text: '已成交',
  },
]);

// 所有线索阶段
export const allPhase = filterArray([
  {
    type: 1,
    text: '待分配',
  },
  {
    type: 2,
    text: '待跟进',
  },
  {
    type: 3,
    text: '待邀约',
  },
  {
    type: 4,
    text: '待试听',
    eduOnly: true,
  },
  {
    type: 5,
    text: '已试听',
    eduOnly: true,
  },
  {
    type: 6,
    text: '已成交',
  },
  {
    type: 7,
    text: '已放弃',
  },
  {
    type: 8,
    text: '已删除',
  },
]);

// 体验课来源
export const RESERVE_SOURCE = {
  2: '线上预约',
  3: '手动录入',
  4: '线上预约',
};

export const RESERVE_STATUS_MAP = {
  1: '待确认',
  2: '待上课',
  4: '已签到',
  6: '未到',
  7: '请假',
  5: '已取消',
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
