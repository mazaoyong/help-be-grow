import {
  IExerciseDetailItemDTO,
} from 'definitions/api/owl/api/ReviewerExerciseFacade/getHomeworkDetail';
import { SCORE_TYPE, WORKBOOK_STATUS } from '../constants';
import {
  IPublishSettings,
  IReviewSettings,
  IStudent,
  IWorkbook,
} from '../types';
import Assignment from './Assignment';

export interface IHomeworkData {
  id: number
  alias?: string
  title: string
  detail: Array<IExerciseDetailItemDTO>
  scoreRule: number
  scoreType: number
  enableTimer: number
  publishTime?: number
  endTime: number
  workbookId: number
  status?: number
  submitCount: number
  submitAndExitCount: number
  unreviewedCount: number
  selectedCount: number
  selectedId: number
}

class Homework {
  initialData: any // 接口原始数据

  id: number // id
  alias?: string // 别名
  title: string // 标题
  detail: IExerciseDetailItemDTO[] // 作业详情

  // 时间相关
  publishTime?: number // 发布时间

  // 配置项
  publishSettings: IPublishSettings // 发布设置
  reviewSettings: IReviewSettings // 批阅设置

  // 学员及作业
  students?: IStudent[] // 学员列表
  assignments?: Assignment[] // 学员作业
  submitCount: number
  submitAndExitCount: number
  reviewedCount: number
  unreviewedCount: number
  selectedCount: number
  selectedId: number

  // 作业本
  workbook?: IWorkbook // 作业本

  constructor(initialData: IHomeworkData) {
    this.initialData = initialData

    this.id = initialData.id
    this.alias = initialData.alias
    this.title = initialData.title
    this.detail = initialData.detail || []
    this.submitCount = initialData.submitCount || 0
    this.submitAndExitCount = initialData.submitAndExitCount || 0
    this.unreviewedCount = initialData.unreviewedCount || 0
    this.reviewedCount = initialData.submitCount - initialData.unreviewedCount
    this.selectedCount = initialData.selectedCount || 0
    this.selectedId = initialData.selectedId || 0
    this.reviewSettings = {
      scoreRule: initialData.scoreRule,
      scoreType: initialData.scoreType,
    }
    this.publishSettings = {
      enableTimer: initialData.enableTimer,
      publishTime: initialData.publishTime || 0,
      endTime: initialData.endTime || 0,
    }
    this.workbook = {
      id: initialData.workbookId,
      status: initialData.status as WORKBOOK_STATUS,
    }
  }

  get totalCount() { // 学员作业总数
    return this.assignments?.length || 0;
  }

  get isLevelScore() {
    return this.reviewSettings.scoreType === SCORE_TYPE.LEVEL;
  }

  get isNumberScore() {
    return this.reviewSettings.scoreType === SCORE_TYPE.SCORE;
  }
}

export default Homework
