import { BooleanLike, ICorrectDTO } from '../types';
import type { IWorkbookFormEdit } from 'domain/workbook-domain/types';
import type { IHomeworkDetailDTO } from 'domain/homework-domain/types/homework';
import type {
  IStudentBriefDTO,
  IExerciseDetailItemDTO,
  IHomeworkReviewDTO,
} from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import type { IAssignmentSortDTO } from 'definitions/api/owl/pc/ReviewerFacade/assignmentSort';
import type { IExerciseDetailItemCommand } from 'definitions/api/owl/pc/ReviewerFacade/review';

/**
 * 批阅
 */
export default class Correct {
  id: number;
  hasReviewed: boolean;
  answerDetail: IExerciseDetailItemDTO[];
  workbook: IWorkbookFormEdit;
  homework: IHomeworkDetailDTO;
  hasNextAssignment: boolean;
  reviewDTO: IHomeworkReviewDTO;
  studentDTO: IStudentBriefDTO;
  hasQuit: BooleanLike;
  viewPrevAssignmentId: number;
  viewNextAssignmentId: number;
  reviewNextAssignmentId: number;
  score: string;
  isGoodAssignment: BooleanLike;
  comment: IExerciseDetailItemCommand[];

  constructor(correct: Record<string, any>) {
    this.id = correct.id;
    this.hasReviewed = correct.hasReviewed ?? false;
    this.answerDetail = correct.answerDetail;
    this.workbook = correct.workbook;
    this.homework = correct.homework;
    this.hasNextAssignment = correct.hasNextAssignment;
    this.reviewDTO = correct.reviewDTO;
    this.studentDTO = correct.studentDTO;
    this.hasQuit = correct.hasQuit;
    this.viewPrevAssignmentId = correct.viewPrevAssignmentId;
    this.viewNextAssignmentId = correct.viewNextAssignmentId;
    this.reviewNextAssignmentId = correct.reviewNextAssignmentId;
    this.score = correct.score;
    this.isGoodAssignment = correct.isGoodAssignment;
    this.comment = correct.comment;
  }

  getWorkbookData() {
    return this.workbook;
  }

  getHomeworkData() {
    return this.homework;
  }

  getAnswerDetail() {
    return this.answerDetail;
  }

  getReviewData() {
    return this.reviewDTO;
  }

  getStudent() {
    return {
      ...this.studentDTO,
      hasQuit: this.hasQuit,
    };
  }

  getCorrectData(): ICorrectDTO {
    return {
      id: this.id,
      hasReviewed: this.hasReviewed,
      answerDetail: this.answerDetail,
      workbook: this.workbook,
      homework: this.homework,
      reviewDTO: this.reviewDTO,
      studentDTO: this.studentDTO,
      hasQuit: this.hasQuit,
    };
  }

  getCorrectSibilings(): IAssignmentSortDTO {
    return {
      viewNextAssignmentId: this.viewNextAssignmentId,
      reviewNextAssignmentId: this.reviewNextAssignmentId,
      viewPrevAssignmentId: this.viewPrevAssignmentId,
    };
  }

  // getCorrectReview(): ICorrectFormData | void {
  //   if (this.id) {
  //     return {
  //       score: this.score,
  //       isGoodAssignment: this.isGoodAssignment,
  //       comment: this.comment,
  //       type: this.type,
  //       assignmentId: this.id,
  //     };
  //   }
  // }
};
