import { IExerciseDetailItemDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import {
  MEDIA_ITEM_TYPE,
  PUBLISH_TYPE,
  SCORE_RULE,
  SCORE_TYPE,
  WORKBOOK_STATUS,
} from './constants';

export interface IImage {}
export interface IAudio {}
export interface IVideo {}

export interface IReviewSettings {
  scoreRule?: SCORE_RULE // 计分规则
  scoreType: SCORE_TYPE // 评分机制
}

export interface IPublishSettings {
  enableTimer: PUBLISH_TYPE // 发布类型： 1 定时 0 普通
  publishTime: number // 发布时间
  endTime: number // 结束时间
}

export interface IWorkbook {
  id: number
  status: WORKBOOK_STATUS
  title?: string
  homeworkNum?: number
  toReviewNum?: number
}

export interface IStudent {
  id: number
}

// 作业详情子项
export interface IMediaItem {
  type: MEDIA_ITEM_TYPE
  content: any
}

export interface IAssignmentRichText {
  content: string
}
export interface IAssignmentImage {
  url: string
}
export interface IAssignmentAudio {
  name: string
  size: number
  url: string
}
export interface IAssignmentVideo {
  name: string
  size: number
  url: string
}
export interface IAssignmentItem<T> {
  type: T
  content: T extends MEDIA_ITEM_TYPE.RICHTEXT
    ? IAssignmentRichText :
      T extends MEDIA_ITEM_TYPE.IMAGE
        ? IAssignmentImage :
          T extends MEDIA_ITEM_TYPE.AUDIO
            ? IAssignmentAudio : IAssignmentVideo
}
export interface IReview {
  text: string
  images: IImage[]
  audios: IAudio[]
  videos: IVideo[]
}

export interface IHomework {
  id: number
  title: string
}

export interface IAssignmentStudent {
  role: number
  name: string
  mobile: string
  avatar: string
  userId: number
}

export interface IReviewer {
  name: string
  mobile: string
  userId: number
}

export type ICommentItem = IExerciseDetailItemDTO;
