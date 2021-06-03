import {
  IPictureDetailItemDTO,
  IVideoDetailItemDTO,
  IAudioDetailItemDTO,
} from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';

export enum CorrectPageViewType {
  /** 查看批阅 */
  VIEW = 'view',
  /** 修改批阅 */
  EDIT = 'edit',
}

/** 批阅来源（从作业本学员的全部作业处 or 从作业本某一作业的全部学员处） */
export enum CorrectPageSource {
  /** from作业本 */
  WORKBOOK = 'workbook',
  HOMEWORK = 'homework',
}

export type CorrectGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface ICorrectForm {
  grade?: string | null;
  score?: string | null;
  isGoodAssignment: string | null;
  comment: string;
  media: {
    image?: IPictureDetailItemDTO[];
    video?: IVideoDetailItemDTO[];
    audio?: IAudioDetailItemDTO[];
  };
}

export enum RenderType {
  FORM = 1,
  DETAIL,
};
