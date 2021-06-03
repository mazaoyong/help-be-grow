import { IImportStudentGridColumn } from './types';

export { IMPORT_TYPE } from 'components/import-list/constants';

export const FILE_TEMPLATE = {
  byCourse: '//b.yzcdn.cn/public_files/2020/06/02/学员导入模板（按课时&有效期）0602.xlsx',
  byClass: '//b.yzcdn.cn/public_files/2020/05/13/学员导入模板（按班级）.xlsx',
};

export const importColumns: IImportStudentGridColumn[] = [
  {
    title: '学员姓名',
    name: 'studentName',
    width: 160,
    fixed: 'left',
  },
  {
    title: '家长或本人手机号',
    name: 'mobile',
    width: 160,
    fixed: 'left',
  },
  {
    title: '课程',
    width: 160,
    name: 'courseName',
    type: 'course',
  },
  {
    title: '班级',
    width: 180,
    name: 'className',
    type: 'class',
  },
  {
    title: '课程实付金额(元)',
    width: 160,
    name: 'courseRealPay',
    textAlign: 'right',
  },
  {
    title: '付款方式',
    name: 'payTool',
  },
  {
    title: '报名日期',
    width: 180,
    name: 'enrollTime',
  },
  {
    title: '剩余课时',
    name: 'availableCourseTime',
    type: 'course',
  },
  {
    title: '购买课时',
    name: 'totalCourseTime',
    type: 'course',
  },
  {
    title: '开始日期',
    width: 180,
    name: 'validStartTime',
    type: 'course',
  },
  {
    title: '结束日期',
    width: 180,
    name: 'validEndTime',
    type: 'course',
  },
  {
    title: '课程顾问',
    width: 120,
    name: 'courseCounselor',
    fixed: 'right',
  },
];

export const studentInfoColumnsPrefix: IImportStudentGridColumn[] = [
  {
    title: '学员姓名',
    name: 'edu_stuName',
    width: 160,
    fixed: 'left',
  },
  {
    title: '联系人手机',
    name: 'edu_stuContractPhone',
    width: 160,
    fixed: 'left',
  },
];

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

export const batchOperationMap = {
  courseName: '修改课程',
  payTool: '修改支付方式',
  enrollTime: '修改报名时间',
  totalCourseTime: '修改购买课时',
  className: '修改班级',
};

export const upsertStudentDefaultValue = {
  studentName: '',
  mobile: '',
  courseRealPay: '',
  period: ['', ''],
  validDate: ['', ''],
};

export const dialogIdMap = {
  validatePolling: 'validate-polling-dialog',
  importPolling: 'import-polling-dialog',
  upsertStudent: 'upsert-student-dialog',
  duplicateList: 'duplicate-list-dialog',
  conflictList: 'conflict-list-dialog',
  importConfirm: 'import-confirm-dialog',
  importCancel: 'import-cancel-dialog',
  reimport: 'reimport-dialog',
  confirmDialog: 'polling-confirm-dialog',
};

// form表单项为下拉菜单格式的字段
export const ebizSelectFields = ['className', 'courseName', 'courseCounselor'];

export const selectFields = ['payTool'];

export const dateFields = ['enrollTime'];

// 表格中整数的字段
export const gridNumberFields = ['period'];

export const estimateValidateTime = 300; // 等待后端校验进度，暂定300ms，之后会优化成弹窗轮询进度。
export const estimateValidateTimePerData = 100; // 超过3条数据，就用条数 * 100ms，最多10条。

export enum IMPORT_INFO_TYPE {
  CourseInfo = 1,
  StudentInfo,
}
