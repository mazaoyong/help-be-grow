import { format } from 'date-fns';
import { IWorkbookStudentList, HomeworkStudentType } from '../types/homework-student';
import { WorkbookStudentStatus } from 'domain/assignment-domain/types/assignment';
import type { IAttributeValueDTO } from 'definitions/api/owl/pc/ExerciseBookStatisticsFacade/findStudentPageByCondition';

/**
 * 作业 - 学生
 */
export default class HomeworkStudent {
  workbookId: number;
  role: HomeworkStudentType;
  userId: number;
  name: string;
  mobile: string;
  avatar: string;
  hasLeft: WorkbookStudentStatus;
  joinTime: string;
  assignmentNum: number;
  completedAssignmentNum: number;
  goodAssignmentNum: number;
  awaitMarkingNum: number;
  enrollmentInfo: IAttributeValueDTO[];
  detailLink: string;

  constructor(student: Record<string, any>) {
    this.workbookId = student?.workbookId;
    this.role = student?.role || 1;
    this.userId = student?.userId;
    this.name = student?.name || '';
    this.mobile = student?.mobile;
    this.avatar = student?.avatar || '';
    this.hasLeft = student?.hasLeft ?? false;
    this.joinTime = student?.joinTime;
    this.assignmentNum = student?.assignmentNum ?? 0;
    this.completedAssignmentNum = student?.completedAssignmentNum ?? 0;
    this.goodAssignmentNum = student?.goodAssignmentNum ?? 0;
    this.awaitMarkingNum = student?.awaitMarkingNum ?? 0;
    this.enrollmentInfo = student?.enrollmentInfo;
    this.detailLink = student?.detailLink || '';
  }

  getJoinTime() {
    return this.joinTime ? format(this.joinTime, 'YYYY-MM-DD HH:mm:ss') : '-';
  }

  getStudentDetailLink() {
    if (this.role && this.userId) {
      return this.role === HomeworkStudentType.STUDENT
        ? `${_global.url.v4}/vis/edu/page/student#/detail/${this.userId}`
        : `${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${this.userId}`;
    }
    return '';
  }

  getWorkbookStudentAssignmentLink() {
    return `${_global.url.v4}/vis/supv/homework/assignment/list?workbookId=${this.workbookId}&studentId=${this.userId}&studentName=${this.name}`;
  }

  getListData(): IWorkbookStudentList {
    return {
      name: this.name,
      mobile: this.mobile,
      avatar: this.avatar,
      hasLeft: this.hasLeft,
      joinTime: this.getJoinTime(),
      assignmentNum: this.assignmentNum,
      completedAssignmentNum: this.completedAssignmentNum,
      goodAssignmentNum: this.goodAssignmentNum,
      awaitMarkingNum: this.awaitMarkingNum,
      enrollmentInfo: this.enrollmentInfo,
      detailLink: this.getStudentDetailLink(),
      assignmentListLink: this.getWorkbookStudentAssignmentLink(),
    };
  }
}
