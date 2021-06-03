import { format } from 'date-fns';
import { IHomeworkListDTO, homeworkInstockStatus, IHomeworkDetailDTO, RateType, ScoreRule } from '../types/homework';
import { BooleanLike } from '../types/common';
import type { IExerciseDetailItemDTO } from 'definitions/api/owl/pc/HomeworkFacade/getHomeworkDetail';

/**
 * 作业本作业
 */
export default class Homework {
  id: number | null;
  alias: string;
  title: string;
  kdtId: number;
  workbookId: number | null;
  publishTime: string;
  deadlineTime: string;
  submitNum: number;
  submitTotalNum: number;
  totalNum: number;
  submitRatio: number;
  awaitMarkingNum: number;
  status: homeworkInstockStatus;
  rateType: RateType;
  hasPublishTimer: BooleanLike;
  timerPublishAt: string;
  scoreRule: ScoreRule;
  detail?: IExerciseDetailItemDTO[];

  constructor(homework: Record<string, any>) {
    this.id = homework?.id;
    this.alias = homework?.alias || '';
    this.title = homework?.title || '';
    this.kdtId = homework?.kdtId || _global.kdtId;
    this.workbookId = homework?.workbookId;
    this.publishTime = homework?.publishTime ?? '';
    this.deadlineTime = homework?.deadlineTime ?? '';
    this.submitNum = homework?.submitNum ?? 0;
    this.submitTotalNum = homework?.submitTotalNum ?? 0;
    this.totalNum = homework?.totalNum ?? 0;
    this.submitRatio = homework?.submitRatio ?? 0;
    this.awaitMarkingNum = homework?.awaitMarkingNum ?? 0;
    this.status = homework?.status ?? homeworkInstockStatus.inStock;
    this.rateType = homework?.rateType ?? RateType.POINT;
    this.hasPublishTimer = homework?.hasPublishTimer ?? BooleanLike.False;
    this.timerPublishAt = homework?.timerPublishAt ?? '';
    this.scoreRule = homework?.scoreRule ?? ScoreRule.TEN;
    this.detail = homework?.detail;
  }

  getPublishTime() {
    return this.publishTime ? format(this.publishTime, 'YYYY-MM-DD HH:mm:ss') : '-';
  }

  getDeadlineTime() {
    return this.deadlineTime ? format(this.deadlineTime, 'YYYY-MM-DD HH:mm:ss') : '-';
  }

  getSubmitRatio() {
    return this.submitRatio + '%';
  }

  getListData(): IHomeworkListDTO | undefined {
    if (this.id) {
      return {
        id: this.id,
        alias: this.alias,
        title: this.title,
        kdtId: this.kdtId,
        // workbookId: this.workbookId,
        publishTime: this.getPublishTime(),
        deadlineTime: this.getDeadlineTime(),
        submitNum: this.submitNum,
        totalNum: this.totalNum,
        submitRatio: this.getSubmitRatio(),
        awaitMarkingNum: this.awaitMarkingNum,
        status: this.status,
      };
    }
  }

  getHomeworkDetail(): IHomeworkDetailDTO | undefined {
    if (this.id && this.workbookId) {
      return {
        id: this.id,
        workbookId: this.workbookId,
        rateType: this.rateType,
        hasPublishTimer: this.hasPublishTimer,
        submitNum: this.submitNum,
        submitTotalNum: this.submitTotalNum,
        alias: this.alias,
        timerPublishAt: this.timerPublishAt,
        scoreRule: this.scoreRule,
        detail: this.detail,
        title: this.title,
        deadlineTime: this.deadlineTime,
        status: this.status,
      };
    }
  }
};
