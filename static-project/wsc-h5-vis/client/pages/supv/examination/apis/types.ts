import {
  ExamStatus,
  UserExamStatus,
  MediaType,
  OwlType,
  AnsweredPaperState,
  IAnswerCard,
} from 'supv/examination/types';

export interface StartResponse extends VisResponse {
  data: {
    examId: number;
    endTime: number;
    joinEndTime: number;
    joinStartTime: number;
    remainMillisecond: number;
    startTime: number;
    userExamId: number;
    userId: number;
  }
}

interface IUserExamDTO {
  endTime: string;
  examId: number;
  inThisExam: boolean;
  joinStartTime: string;
  joinEndTime: string;
  kdtId: number;
  remainMillisecond: number;
  startTime: string;
  state: number;
  userExamId: number;
  userId: number;
}
export interface QuestionResponse {
  answerTexts: string[];
  correct: boolean;
  chooseOptionIds: string[];
  currentQuestionId: string;
  expireExamEndTime: boolean;
  examTitle: string;
  fillCount: number;
  hasPrev: boolean;
  hasNext: boolean;
  question: {
    group: string;
    isOrdered: boolean;
    questionId: number;
    kdtId: number;
    level: number;
    options: { content?: string; optionId?: string; correct?: boolean }[]
    score: number;
    serialNo: number;
    title: string;
    type: number;
  }
  serialNo: number;
  userAnswerReview?: {
    correct: boolean;
    examAnswer: {
      answers: string[];
      analysis: string;
      grading: any;
      kdtId: number;
      questionId: number;
    }
    review: {
      comment: string;
      questionId: number;
      score: number;
    }
    score: number;
    userAnswer: {
      correct: boolean;
      contents: string[];
      options: string[];
      fills: { blank: string; correct: boolean }[];
    },
    standardAnswer: {
      contents?: string[];
      options?: string[];
      correct?: boolean;
    }
    paperState: 1 | 2;
  }
  userExamDTO: IUserExamDTO;
}

export interface QuestionListResponse extends VisResponse {}

export interface AnswerCardResponse {
  answerCard: IAnswerCard;
  userExam: {
    endTime: number;
    examId: number;
    inThisExam: boolean;
    joinStartTime: number;
    joinEndTime: number;
    kdtId: number;
    remainMillisecond: number;
    startTime: number;
    userExamId: number;
    userId: number;
  }
}

export interface DetailResponse {
  collectSetting: ICollectSetting[];
  examDTO: {
    countdownSeconds: number;
    detail: string;
    duration: number;
    displayType: number;
    examFrequency: any;
    joinUserAvatars: string[];
    openCourseSettingDetail: boolean;
    publishType: number;
    picture: {
      coverUrl: string;
      picWidth: number;
      picHeight: number;
      picId: number;
    }
    questionCount: number;
    questionIds: number[];
    status: ExamStatus;
    totalScore: number;
    title: string;
    timerPublishAt: number;
    validity: any;
    publishStatus: 1 | 2; // 1 已发布 2 未发布
  },
  userJoinInfo: {
    canJoinExamStudentIds: number[];
    canRejoinCount: number;
    canJoinExam: boolean;
    joinUserCount: number;
    nextRejoinSeconds: number;
    userExamStatus: UserExamStatus;
    userExamId: number;
  }
}

export interface ResultResponse {
  examTitle: string;
  displayType: 1 | 2 | 3; // 答案展示类型 AFTER_COMMIT(1, "提交考试后立即展示"), AFTER_REVIEW(2, "提交且批阅完成后展示"), HIDE(3, "隐藏"),
  examResult: {
    finalScore: number;
    state: 1 | 2; // 1:批阅中, 2: 完成批阅
  }
  examUser: {
    name: string;
  }
  userExam: {
    joinEndTime: number;
  }
  joinInfo: {
    canJoinExam: boolean;
    canRejoinCount: number;
    nextRejoinSeconds: number;
    canJoinExamStudentIds: number[];
  }
  examDTO: {
    status: ExamStatus;
    publishStatus: 1 | 2; // 1 已发布 2 未发布
  }
}

interface IExam {
  kdtId: number;
  userId: number;
  examId: number;
  title: string;
  cover: string;
  joinState: 0 | 1; // 0 未参与 1 已参与
  answeredPaperState: AnsweredPaperState;
  relateCourses: string[];
  canRejoinCount: number;
}
export interface ExamListResponse extends PageableResponseData<IExam> {}

interface ICourse {
  alias: string;
  cover: string;
  courseType: OwlType;
  kdtId: number;
  mediaType: MediaType;
  price: number;
  title: string;
}
export interface CourseListRespoinse extends PageableResponseData<ICourse> {}

export interface CourseExamResponse {
  cover: string;
  duringSeconds: number;
  examId: number;
  kdtId: number;
  questionCount: number;
  title: string;
  totalExamCount: number;
  totalScore: number;
  userExamState: 0 | 1 | 2; // 0 未参与 1 未提交 2 已提交
}

export interface CourseExamListResponse extends PageableResponseData<CourseExamResponse> {
}

interface IRecommendGoods {
  alias: string;
  cover: string;
  courseType: OwlType;
  kdtId: number;
  mediaType: MediaType;
  price: number;
  title: string;
}
export interface RecommendListRespoinse extends PageableResponseData<IRecommendGoods> {}
