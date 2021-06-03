import { ExamStatus, UserExamStatus } from 'supv/examination/types';

export interface DetailState {
  valid: boolean; // 考试是否有效
  coverUrl: string;
  title: string;
  duration: number;
  questionCount: number;
  userAvatars: string[];
  score: number;
  detail: string;
  status: ExamStatus;
  userExamStatus: UserExamStatus;
  canJoinExam: boolean;
  hasLimit: boolean; // 是否有门槛
  studentIds: number[]; // 可选择的学员列表
  leftSeconds: number; // 距离考试开始时间
  canReexam: boolean; // 可以重考
  reexamLeftSeconds: number; // 重考间隔剩余时间
  infoCollectorSettings: any[];
  publishStatus: 1 | 2; // 1 已发布 2 未发布
}

const state: DetailState = {
  valid: true,
  coverUrl: '',
  title: '',
  duration: 0,
  questionCount: 0,
  userAvatars: [],
  score: 0,
  detail: '',
  status: ExamStatus.NOT_STARTED,
  userExamStatus: UserExamStatus.NOT_JOIN,
  canJoinExam: false,
  hasLimit: false,
  studentIds: [],
  leftSeconds: 0,
  canReexam: false,
  reexamLeftSeconds: 0,
  infoCollectorSettings: [],
  publishStatus: 2,
};

export default state;
