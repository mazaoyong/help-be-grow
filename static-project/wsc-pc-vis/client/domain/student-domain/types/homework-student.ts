import type { IExerciseStudentPageQuery, IPageRequest, IAttributeValueDTO } from 'definitions/api/owl/pc/ExerciseBookStatisticsFacade/findStudentPageByCondition';
import { WorkbookStudentStatus } from 'domain/assignment-domain/types/assignment';

export interface IWorkbookStudentListQuery {
  query: IExerciseStudentPageQuery;
  pageRequest: IPageRequest;
}

export enum HomeworkStudentType {
  CUSTOMER = 1,
  STUDENT,
}

export interface IWorkbookManageStudent {
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
}

export interface IWorkbookStudentList {
  name: string;
  mobile: string;
  avatar: string;
  hasLeft: WorkbookStudentStatus;
  joinTime: string;
  completedAssignmentNum: number;
  assignmentNum: number;
  goodAssignmentNum: number;
  awaitMarkingNum: number;
  enrollmentInfo: IAttributeValueDTO[];
  detailLink: string;
  assignmentListLink: string;
}
