import { instockStatusFilterType, workbookPublishStatus } from 'domain/workbook-domain/types';

export const workbookStockOperationMap = {
  [workbookPublishStatus.inStock]: '下架',
  [workbookPublishStatus.offStock]: '上架',
};

export const instockStatusMap = {
  [instockStatusFilterType.all]: '全部',
  [instockStatusFilterType.inStock]: '已上架',
  [instockStatusFilterType.outOfStock]: '已下架',
};

export enum WorkbookManageViewType {
  /** 作业本中的作业列表 */
  HOMEWORKS = 'homeworks',
  /** 作业本中的学生列表 */
  STUDENTS = 'students',
};

export const defaultSummaryData = {
  assignmentNum: 0,
  awaitMarkingNum: 0,
  id: null,
  title: '加载中...',
  studentNum: 0,
  subNum: 0,
  submitRate: '0%',
};

export const summaryTitleMap = {
  assignmentNum: '作业数',
  studentNum: '学员数',
  submitRate: '作业提交率',
  awaitMarkingNum: '待批阅作业数',
};

export const workbookListSortMap = {
  joinStudentNum: 'stu_num',
  assignmentNum: 'homework_num',
  createdAt: 'created_at',
};

/** 作业本管理 - 学员列表 导出的类型定义 */
export const WORKBOOK_STUDENT_EXPORT_TYPE = 22;
