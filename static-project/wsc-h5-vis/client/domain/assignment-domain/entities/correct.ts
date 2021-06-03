import { IMediaBlock } from '@/domain/workbook-domain/entities/workbook';

export default class CorrectInfo {
  /** 批改时间 */
  submitTime: Date;
  /** 批改详情 */
  detail: IMediaBlock[];
  /** 评分 */
  grade: string;
  /** 是否是优秀作业 */
  isExecellentHomework: boolean;

  constructor(correctInfo: any) {
    this.submitTime = new Date(correctInfo.submitTime);
    this.detail = correctInfo.detail;
    this.grade = correctInfo.grade;
    this.isExecellentHomework = correctInfo.isExecellentHomework;
  }
}
