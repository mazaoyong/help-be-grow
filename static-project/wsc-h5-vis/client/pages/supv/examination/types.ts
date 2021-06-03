export interface ICourse {
  alias: string;
  owlType: OwlType;
  mediaType: MediaType;
  img: string;
  title: string;
  price: number;
  users: number;
}

export enum AnsweredPaperState {
  NOT_COMMITTED = 1,
  WAIT_REVIEW,
  REVIEWED,
}

export enum AnswerMode {
  PREVIEW = 'preview',
  ANSWER = 'answer',
  REVIEW = 'review',
}

export interface IAnswerCard {
  correctNum: number;
  errorNum: number;
  questionCount: number;
  questions: IQuestion[];
  subjectNum: number;
  unansweredNum: number;
  userScore: number; // 分数 * 100
  paperState: 1 | 2; // 1: 未打分 2: 已打分
}

export enum QuestionType {
  SINGLE = 1,
  MULTIPLE,
  JUDGE,
  FILL_BLANK,
  SUBJECTIVE,
};

export interface IQuestion {
  correct: boolean;
  questionId: number;
  type: 1 | 2; // 1 主观题 2 客观题
  answered: boolean;
}

export enum UserExamStatus {
  NOT_JOIN = 0, // 未参加
  NOT_COMMITED, // 未提交
  COMMITED,
}

export enum UserRole {
  TEACHER = 0,
  STUDENT = 1
}

export enum ExamStatus {
  NOT_STARTED = 1,
  STARTED,
  ENDED,
}

// 考试结果状态
export enum ExamResultStatus {
  REVIEWING = 1,
  REVIEWED,
}

export enum OwlType {
  /** 专栏 */
  COLUMN = 1,
  /** 内容 */
  CONTENT,
  /** 权益包 */
  BENEFIT,
  /** 直播 */
  LIVE,
  /** 圈子 */
  CIRCLE,
  /** 线下课 */
  COURSE,
}

export enum MediaType {
  /** 图文内容 */
  IMAGE_TEXT = 1,
  /** 音频内容 */
  AUDIO,
  /** 视频内容 */
  VIDEO,
  /** 直播内容 */
  LIVE,
}

export enum AnswerState {
  CORRECT = 1,
  INCORRECT,
  SUBJECTIVE,
  EMPTY,
}
