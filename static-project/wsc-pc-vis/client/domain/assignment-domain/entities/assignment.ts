import { format } from 'date-fns';
import qs from 'qs';
import { assignmentStatusMap, assignmentOperationTextMap } from '../constants';
import {
  IAssignmentDTO,
  IHomeworkAssignmentListDTO,
  IWorkbookAssignmentListDTO,
  StudentAssignmentSubmitStatus,
  StudentType,
  WorkbookStudentStatus,
} from '../types/assignment';
import { BooleanLike } from '../types/common';

/**
 * 作业
 */
export default class Assignment {
  title: string;
  assignmentId: number;
  homeworkId: number;
  workbookId: number;
  studentRole: StudentType;
  studentName: string;
  studentMobile: string;
  studentAvatar: string;
  studentId: number;
  publishTime: string;
  score: string;
  submitTime: string;
  isGoodAssignment: BooleanLike;
  hasQuit: WorkbookStudentStatus;
  status: StudentAssignmentSubmitStatus;
  reviewerUserId: number;
  reviewerUsername: string;
  reviewerMobile: string;

  constructor(assignment: IAssignmentDTO) {
    this.title = assignment?.title;
    this.assignmentId = assignment?.assignmentId;
    this.homeworkId = assignment?.homeworkId;
    this.workbookId = assignment?.workbookId;
    this.studentRole = assignment?.studentRole;
    this.studentName = assignment?.studentName;
    this.studentMobile = assignment?.studentMobile;
    this.studentAvatar = assignment?.studentAvatar;
    this.studentId = assignment?.studentId;
    this.publishTime = assignment?.publishTime;
    this.score = assignment?.score;
    this.submitTime = assignment?.submitTime;
    this.isGoodAssignment = assignment?.isGoodAssignment ?? BooleanLike.False;
    this.hasQuit = assignment?.hasQuit ?? WorkbookStudentStatus.NOT_QUIT;
    this.status = assignment?.status ?? StudentAssignmentSubmitStatus.UNSUBMITTED;
    this.reviewerUserId = assignment?.reviewerUserId;
    this.reviewerUsername = assignment?.reviewerUsername;
    this.reviewerMobile = assignment?.reviewerMobile;
  }

  getPublishTime() {
    return format(this.publishTime, 'YYYY-MM-DD HH:mm:ss');
  }

  getSubmitTime() {
    return format(this.submitTime, 'YYYY-MM-DD HH:mm:ss');
  }

  getStudentDetailLink() {
    return this.studentRole === StudentType.STUDENT
      ? `${_global.url.v4}/vis/edu/page/student#/detail/${this.studentId}`
      : `${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${this.studentId}`;
  }

  getStatusText() {
    return assignmentStatusMap[this.status];
  }

  getAssignmentRateText() {
    if (this.isGoodAssignment) {
      return '是';
    }
    return this.status === StudentAssignmentSubmitStatus.MARKED ? '否' : '-';
  }

  getOperationText() {
    return assignmentOperationTextMap[this.status];
  }

  getOperationLink(source: 'workbook' | 'homework') {
    const locationParams = qs.parse(location.search, { ignoreQueryPrefix: true });
    const mergedQuery = {
      ...locationParams,
      homeworkId: this.homeworkId,
      source,
      userId: this.studentId,
      viewType: this.status === StudentAssignmentSubmitStatus.MARKED ? 'view' : 'edit',
    };
    const query = qs.stringify(
      {
        ...mergedQuery,
      },
      { addQueryPrefix: true },
    );

    switch (source) {
      case 'workbook':
        return `${_global.url.v4}/vis/supv/homework/assignment/correct/${this.assignmentId}${query}`;
      case 'homework':
        return `${_global.url.v4}/vis/supv/homework/assignment/correct/${this.assignmentId}${query}`;
    }
  }

  getHomeworkAssignmentListData(): IHomeworkAssignmentListDTO {
    return {
      ...this.getListData(),

      detailLink: this.getStudentDetailLink(),
      assignmentRateText: this.getAssignmentRateText(),
      statusText: this.getStatusText(),
      operationText: this.getOperationText(),
      operationLink: this.getOperationLink('homework'),
    };
  }

  getWorkbookAssignmentListData(): IWorkbookAssignmentListDTO {
    return {
      ...this.getListData(),

      assignmentRateText: this.getAssignmentRateText(),
      statusText: this.getStatusText(),
      operationText: this.getOperationText(),
      operationLink: this.getOperationLink('workbook'),
    };
  }

  getListData(): IAssignmentDTO {
    return {
      title: this.title,
      assignmentId: this.assignmentId,
      homeworkId: this.homeworkId,
      workbookId: this.workbookId,
      studentRole: this.studentRole,
      studentName: this.studentName,
      studentMobile: this.studentMobile,
      studentAvatar: this.studentAvatar,
      studentId: this.studentId,
      publishTime: this.getPublishTime(),
      score: this.score,
      submitTime: this.getSubmitTime(),
      isGoodAssignment: this.isGoodAssignment,
      hasQuit: this.hasQuit,
      status: this.status,
      reviewerUserId: this.reviewerUserId,
      reviewerUsername: this.reviewerUsername,
      reviewerMobile: this.reviewerMobile,
    };
  }
}
