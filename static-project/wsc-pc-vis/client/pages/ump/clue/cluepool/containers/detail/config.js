
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
    text: '变更跟进人',
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
export const phases = [
  {
    type: 2,
    text: '待跟进',
  },
  {
    type: 3,
    text: '待邀约',
  },
  {
    type: 6,
    text: '已成交',
  },
];

// 所有线索阶段
export const allPhase = [
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
];
