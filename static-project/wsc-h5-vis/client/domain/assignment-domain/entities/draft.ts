import { IMediaBlock } from '@/domain/workbook-domain/entities/workbook';

export interface IDraft {
  commitTime?: Date;
  detail: IMediaBlock[];
}

/** 学员作业草稿 */
export default class Draft {
  /** 提交时间 */
  commitTime?: Date;
  /** 提交的学员作业详情 */
  detail: IMediaBlock[];

  constructor(draft: IDraft) {
    this.commitTime = draft?.commitTime;
    this.detail = draft.detail;
  }
}
