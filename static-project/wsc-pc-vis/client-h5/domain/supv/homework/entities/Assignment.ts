import { IExerciseDetailItemDTO } from 'definitions/api/owl/api/ReviewerExerciseFacade/getHomeworkDetail';
import { ASSIGNMENT_STATUS } from '../constants';
import {
  IAssignmentStudent,
  IHomework,
  IReview,
  IReviewer,
  IWorkbook,
  ICommentItem,
} from '../types';
import Homework, { IHomeworkData } from './Homework';

export interface IAssignmentData {
  id: number
  detail: IExerciseDetailItemDTO[]
  submitTime?: number

  hasReviewed: boolean
  status?: ASSIGNMENT_STATUS
  score?: string
  selected?: boolean
  comment?: ICommentItem[]
  draft?: ICommentItem[]
  draftScore: string
  draftSelected: boolean
  reviewer?: IReviewer
  reviewTime: number

  student?: IAssignmentStudent
  homework?: IHomeworkData
  workbook?: IWorkbook
}

export default class Assignment {
  initialData: IAssignmentData

  id: number // 作业 id
  detail: IExerciseDetailItemDTO[] // 作业内容
  submitTime: number // 提交时间

  // 批阅信息
  hasReviewed: boolean // 是否已批阅
  status: ASSIGNMENT_STATUS // 批阅状态
  score: string // 分数
  selected: boolean // 是否是优秀作业
  comment: ICommentItem[] // 老师评语
  draft: ICommentItem[]
  draftScore: string;
  draftSelected: boolean;
  reviewer?: IReviewer // 批阅人信息
  reviewTime: number

  // 关联信息
  homework?: Homework // 作业
  workbook?: IWorkbook // 作业本
  student?: IAssignmentStudent // 学员信息

  constructor(initialData: IAssignmentData) {
    this.initialData = initialData;

    this.id = initialData.id;
    this.detail = initialData.detail;
    this.submitTime = initialData.submitTime || Date.now();

    this.hasReviewed = initialData.hasReviewed || false;
    this.status = initialData.status || ASSIGNMENT_STATUS.UNREVIEWED;
    this.score = initialData.score || '';
    this.selected = initialData.selected || false;
    this.comment = initialData.comment || [];
    this.draft = initialData.draft || [];
    this.draftScore = initialData.draftScore || '';
    this.draftSelected = initialData.draftSelected || false;
    this.reviewer = initialData.reviewer;
    this.reviewTime = initialData.reviewTime;

    this.homework = initialData.homework && new Homework(initialData.homework);
    this.workbook = initialData.workbook;
    this.student = initialData.student;
  }
}
