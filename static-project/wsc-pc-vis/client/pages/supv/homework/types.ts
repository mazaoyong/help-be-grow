
import { IVideoDetailItemDTO, IRichTextDetailItemDTO, IAudioDetailItemDTO, IDocumentDetailItemDTO } from 'definitions/api/owl/pc/HomeworkFacade/getHomeworkDetail';

export enum HomeworkViewType {
  ALL = '0',
  UNMARKED = '1',
  MARKED = '2',
}

export enum ElementType {
  RichText = 1,
  Picture,
  Audio,
  Video,
  Document,
};

export enum BooleanLike {
  False = 0,
  True,
};

interface IDetailElementBase {
  // order: number; (是否必要？)
}

export interface IFrontVideoDetailItem extends IVideoDetailItemDTO {
  videoUrl: string;
  uploadStatus?: 0 | -1 | 1;
  deleted?: boolean;
}

export interface IRichtextElement extends IDetailElementBase {
  mediaType: ElementType.RichText;
  richTextItem?: IRichTextDetailItemDTO;
}

export interface IAudioElement extends IDetailElementBase {
  mediaType: ElementType.Audio;
  audioItem: IAudioDetailItemDTO;
}

export interface IVideoElement extends IDetailElementBase {
  mediaType: ElementType.Video;
  videoItem: IFrontVideoDetailItem;
}

export interface IDocumentElement extends IDetailElementBase {
  mediaType: ElementType.Document;
  documentItem: IDocumentDetailItemDTO;
}

export interface IFormElement {
  key?: string;
  mediaType: ElementType;
  detail: IRichTextDetailItemDTO | IAudioDetailItemDTO | IFrontVideoDetailItem | IDocumentDetailItemDTO;
  serialNo: number;
}

export type DetailElementType = IRichtextElement | IAudioElement | IVideoElement | IDocumentElement;
