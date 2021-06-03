import { ajax } from '@youzan/vis-ui';
import {
  UserRole,
  UserExamStatus,
} from 'supv/examination/types';
import {
  StartResponse,
  QuestionResponse,
  DetailResponse,
  ResultResponse,
  ExamListResponse,
  CourseListRespoinse,
  AnswerCardResponse,
  CourseExamResponse,
  CourseExamListResponse,
  RecommendListRespoinse,
} from './types';

const pathPrefix = '/wscvis/supv/examination';

// 开始考试
export function startExam(data: {
  examId: number;
  joinStudentId: number;
  attrItem: any[];
  userRole: UserRole;
}): Promise<StartResponse> {
  return ajax({
    url: `${pathPrefix}/startExam.json`,
    type: 'POST',
    loading: false,
    data,
  });
};

// 获取考试介绍详情
export function getDetail(data: {
  examId: number;
}): Promise<DetailResponse> {
  return ajax({
    url: `${pathPrefix}/getDetail.json`,
    data,
  });
  // return getDetailData;
};

// 获取考试关联的课程列表
export function getCourseList(data: {
  pageRequest: {
    pageNumber: number;
    pageSize: number;
  };
  examTemplateId: number;
}): Promise<CourseListRespoinse> {
  return ajax({
    url: `${pathPrefix}/getCourseList.json`,
    loading: false,
    data,
  });
}

// 获取可参加考试的学员列表
export function getStudentList(data: {
  examId: number;
}): Promise<IStudent[]> {
  return ajax({
    url: `${pathPrefix}/getStudentList.json`,
    loading: false,
    data,
  });
}

// 获取推荐商品列表
export function getRecommendList(data: {
  pageRequest: {
    pageNumber: number;
    pageSize: number;
  }
  examTemplateId: number;
}): Promise<RecommendListRespoinse> {
  return ajax({
    url: `${pathPrefix}/getRecommendList.json`,
    loading: false,
    data,
  });
}

// 获取上次回答的试题
export function getLatestQuestion(data: {
  examId: number;
  visitMode: string;
}): Promise<QuestionResponse> {
  return ajax({
    url: `${pathPrefix}/getLatestQuestion.json`,
    data,
  });
};

// 获取上一道题
export function getPrevQuestion(data: {
  currentQuestionId: number;
  examId: number;
  userExamId: number;
  visitMode: string;
}): Promise<QuestionResponse> {
  return ajax({
    url: `${pathPrefix}/getPrevQuestion.json`,
    loading: false,
    data,
  });
};

// 获取下一道题
export function getNextQuestion(data: {
  currentQuestionId: number;
  examId: number;
  userExamId: number;
  visitMode: string;
}): Promise<QuestionResponse> {
  return ajax({
    url: `${pathPrefix}/getNextQuestion.json`,
    loading: false,
    data,
  });
};

export function getQuestion(data: {
  currentQuestionId: number;
  examId: number;
  userExamId: number;
  visitMode: string;
}): Promise<QuestionResponse> {
  return ajax({
    url: `${pathPrefix}/getQuestion.json`,
    loading: false,
    data,
  });
};

export function getAnswerCard(data: {
  examId: number;
  userExamId: number;
  visitMode: string;
}): Promise<AnswerCardResponse> {
  return ajax({
    url: `${pathPrefix}/getAnswerCard.json`,
    loading: false,
    data,
  });
};

interface AnswerQuestionResponse {}
export function answerQuestion(data: {
  answerTexts?: string[];
  correct?: boolean;
  chooseOptionIds?: string[];
  currentQuestionId: number;
  examId: number;
  userExamId: number;
  next?: 1 | -1 | 0; // 1 下一道题 -1 上一道题
}): Promise<AnswerQuestionResponse> {
  return ajax({
    url: `${pathPrefix}/answerQuestion.json`,
    type: 'POST',
    loading: false,
    data,
  });
};

interface SubmitResponse {
  examRemainMillisecond: number;
  submitSuccess: boolean;
}
export function submit(data: {
  autoSubmit: boolean;
  userExamId: number;
}): Promise<SubmitResponse> {
  return ajax({
    url: `${pathPrefix}/submit.json`,
    loading: false,
    data,
  });
};

export function getResult(data: {
  examId: number;
  userExamId: number;
}): Promise<ResultResponse> {
  return ajax({
    url: `${pathPrefix}/getResult.json`,
    data,
  });
};

export function getUserExamList(data: {
  state: UserExamStatus;
  pageRequest: {
    pageNumber: number;
    pageSize: number;
  }
}): Promise<ExamListResponse> {
  return ajax({
    url: `${pathPrefix}/getUserExamList.json`,
    loading: false,
    data,
  });
};

export function getUserExam(): Promise<{ hasCanJoinExam: boolean }> {
  return ajax({
    url: `${pathPrefix}/getUserExam.json`,
    loading: false,
  });
}

export function getCourseExam(data: {
  alias: string;
}): Promise<CourseExamResponse> {
  return ajax({
    url: '/wscvis/supv/examination/getCourseExam.json',
    data,
    loading: false,
  });
}

export function getCourseExamList(data: {
  alias: string;
}): Promise<CourseExamListResponse> {
  return ajax({
    url: '/wscvis/supv/examination/getCourseExamList.json',
    data,
    loading: false,
  });
}
