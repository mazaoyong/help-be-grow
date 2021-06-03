export const importProgressMap = {
  0: '待导入',
  1: '导入中',
  2: '导入完成',
  10: '导入录入中',
  20: '导入失败',
  30: '数据校验中',
  40: '待导入',
  50: '待导入',
  60: '导入完成',
};

export enum IMPORT_TYPE {
  byCourse = 5,
  byClass = 6,
  byStudentInfo = 8,
}

export const IMPORT_TYPE_TEXT = {
  [IMPORT_TYPE.byCourse]: '学员报读课程',
  [IMPORT_TYPE.byClass]: '学员报读课程',
  [IMPORT_TYPE.byStudentInfo]: '学员基本信息',
};
