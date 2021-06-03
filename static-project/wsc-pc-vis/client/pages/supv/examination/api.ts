import { visAjax } from 'fns/new-ajax';
import { QuestionLevel, QuestionType } from '../types';
import {
  IStatsOverviewData,
  IExamQuestionStatistics,
  IQuetionOptionsChosenRate,
  IExamStatsChartDataItem
} from './pages/stats/types';
import {
  IOptions,
  IGrading,
  ExamPublishType,
  ExamValidityType,
  ExamLimitType,
  ExamAnswerDisplayType,
  ExamStatus,
} from './types';

export interface IQuestionBaseEntity {
  isOrdered: boolean; // 是否固定顺序
  kdtId?: number;
  level: QuestionLevel;
  questionId: number;
  score: number;
  type: QuestionType;
  title: string;
  options: IOptions[];
}

export interface IAnswerEntity {
  answers: string[];
  analysis: string;
  kdtId?: number;
  questionId: number;
  grading: IGrading;
}

export interface IQuestionEntity {
  id: number; // 题目ID
  kdtId?: number;
  examPaperId?: number; // 考卷id，仅当题目加入到考试后有效
  group?: number; // 题目在试卷的分组，暂时不用
  serialNo?: number; // 题目在试卷的序号，仅当题目加入到考试后有效
  question: IQuestionBaseEntity;
  answer: IAnswerEntity;
}

interface IQuestionEntityLite {
  id: number;
  score: number;
  serialNo: number;
  grading?: IGrading;
  group?: number;
}

export interface ITemplateCreateEntity {
  title: string;
  picture: { coverUrl: string; picWidth: number; picHeight: number; picId: number };
  detail: string;
  courseSetting: { courseAliases: string[]; open: number };
  infoCollectSetting: { attributeIds: number[]; open: number, inClue: number };
  publishType: ExamPublishType;
  timerPublishAt?: number;
  validity: { validityType: ExamValidityType; startTime?: number; endTime?: number };
  duration: number;
  examFrequency: { limitType: ExamLimitType; limitTimes?: number; repeatInterval?: number };
  displayType: ExamAnswerDisplayType;
}

export interface ITemplateEditEntity extends ITemplateCreateEntity {
  id: number;
}

interface ICourseDetail {
  id: number;
  alias: string;
  subType: number;
  type: number;
  title: string;
}
export interface ITemplateDetailEntity extends Omit<ITemplateCreateEntity, 'courseSetting'> {
  courseSettingDetail: {
    courseDetails: ICourseDetail[];
    open: number;
  };
}
export interface IExamPaperCreateEntity {
  examTemplateId: number;
  examQuestions: IQuestionEntityLite[];
}

export interface IExamPaperEntity {
  id: number;
  kdtId: number;
  questions: IQuestionEntity[];
}

export interface IExamListEntity {
  id: number;
  createdAt: string;
  status: ExamStatus;
  title: string;
  reviewNum: number;
  unReviewNum: number;
  courseSettingDetail: {
    courseDetails: string[];
    open: number;
  };
  validity: {
    validityType: ExamValidityType;
    startTime?: string;
    endTime?: string;
  };
}

export interface IListEntity<T> {
  content: T[];
  total: number;
}

// 获取二维码
export function getQrcode(url: string, options: any = {}) {
  return visAjax('GET', '/pct/biz/getWscQrcode.json', {
    url: url,
    width: 280,
    height: 280,
    ...options,
  });
}

// 根据id获取题目详情
export function findPaperQuestions(questionIds: number[] | string) {
  return visAjax<IQuestionEntity[]>('POST', '/supv/examination/findPaperQuestions.json', {
    questionIds,
  });
}

// 创建考试模板
export function createExamTemplate(data: ITemplateCreateEntity) {
  return visAjax<number>('POST', '/supv/examination/_textarea_/createExamTemplate.json', data);
}

// 更新考试模板
export function updateExamTemplate(data: ITemplateEditEntity) {
  return visAjax('POST', '/supv/examination/_textarea_/updateExamTemplate.json', data);
}

// 考试试卷创建
export function createExamPaper(data: IExamPaperCreateEntity) {
  return visAjax('POST', '/supv/examination/createExamPaper.json', data);
}

// 获取考试详情
export function getExamTemplateDetail(examTemplateId: number) {
  return visAjax<ITemplateDetailEntity>(
    'GET',
    '/supv/examination/getExamTemplateDetail.json',
    { examTemplateId },
  );
}

// 获取考试最新试卷详情
export function getExamPaperDetail(examTemplateId: number) {
  return visAjax<IExamPaperEntity>('GET', '/supv/examination/getExamPaperDetail.json', {
    examTemplateId,
  });
}

// 分页查询考试列表
export function findPage(pageRequest: any, query: any) {
  return visAjax<IListEntity<IExamListEntity>>('GET', '/supv/examination/findPage.json', { pageRequest, query });
}

// 更新考试状态
export function quickUpdate(id: number, status: ExamStatus) {
  return visAjax('POST', '/supv/examination/quickUpdate.json', { id, status });
}

// 删除考试
export function deleteExam(id: number) {
  return visAjax('POST', '/supv/examination/deleteExam.json', { id });
}

// 获取已参加考试的人数
export function countJoinUsers(examTemplateId: number) {
  return visAjax<number>('GET', '/supv/examination/countJoinUsers.json', { examTemplateId });
}

/*
   +---------------------------------------+
   |              批阅列表                  |
   +--------------------------------------+
*/

// 获取批阅列表
export function findByReview(query) {
  return visAjax('GET', '/supv/examination/findByReview.json', query);
}

export interface IReviewListQueryOptions {
  /** 查询当前答卷的下一个答卷 （后端未实现） */
  queryNext?: boolean;
  /** 查询当前答卷的前一个答卷 （后端未实现） */
  queryPrevious?: boolean;
  /** 查询当前答卷的下一个未批阅的答卷 */
  queryNextNotReview?: boolean;
}

export interface IReviewListQuery {
  /** 查询的答卷详情的 id */
  answerPaperId: number;
  /** 额外查询条件，用于查询上一个/下一个答卷 */
  option?: IReviewListQueryOptions;
}

// 获取批阅详情
export function getReviewDetail(query: IReviewListQuery) {
  return visAjax('GET', '/supv/examination/getReviewDetail.json', query);
}

// 获取条件获取答卷 id
export function getReviewIdByOption(query: IReviewListQuery) {
  return visAjax('GET', '/supv/examination/getReviewIdByOption.json', query);
}

/** 题目的批阅信息 */
export interface IReviewItem {
  comment: string; // 题目的评语
  /** 题目的打分 */
  score: number;
  /** 题目的 id */
  questionId: number
}

/** 提交批阅时传递给后端的数据 */
export interface ISubmitReviewPayload {
  /** 答卷的 id */
  answerPaperId: number;
  /** 题目的批阅信息数组 */
  reviews: IReviewItem[];
}

// 提交批阅
export function submitReview(data: ISubmitReviewPayload) {
  return visAjax('POST', '/supv/examination/submitReview.json', data);
}

// 查询店铺员工，用于批阅筛选
export function findPagePowerStaffs() {
  return visAjax('GET', '/commom/edu/findPagePowerStaffs.json', {
    cluePowerQuery: {
      powerTypes: [11],
      targetKdtId: window._global.kdtId,
    },
  });
}

/*
   +---------------------------------------+
   |              统计页面                  |
   +--------------------------------------+
*/

// 根据考试模板id获取考试基本统计信息
export function getStatsOverviewData(examTemplateId:number): Promise<IStatsOverviewData> {
  return visAjax('GET', `/supv/examination/getBaseStatById.json?examTemplateId=${examTemplateId}`);
}

// 获取学员信息列表
export function getStatsStudentsList(query) {
  return visAjax('GET', '/supv/examination/findPageUserStat.json', query);
}

// 获取学员信息列表
export function exportStastStudentInfo(query) {
  return visAjax('POST', '/supv/examination/exportUserStat.json', query);
}

// 获取当场考试的题目正确率
export function getExamninationCorrectRates(examTemplateId:number): Promise<IExamQuestionStatistics[]> {
  return visAjax(
    'GET',
    `/supv/examination/findPageQuestionStatById.json?examTemplateId=${examTemplateId}`
  );
}

// 获取报名信息
export function getUserExamCollectionInfo(userExamId:number) {
  return visAjax(
    'GET',
    `/supv/examination/getExamUserCollectionInfo.json?userExamId=${userExamId}`
  );
}

// 获取当场考试的题目正确率
export function getQuestionOptionsCorrectRate(query): Promise<IQuetionOptionsChosenRate> {
  return visAjax(
    'GET',
    `/supv/examination/getOptionStatById.json`,
    query
  );
}

// 获取图表数据
export function getExamStatsChartData(examTemplateId: number): Promise<IExamStatsChartDataItem[]> {
  return visAjax(
    'GET',
    `/supv/examination/findListStageStatById.json?examTemplateId=${examTemplateId}`,
  );
}
