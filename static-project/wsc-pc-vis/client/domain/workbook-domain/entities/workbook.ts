import { format } from 'date-fns';
import { BooleanLike, IWorkbookJoinType, visibleOccasionType,
  visibleRangeType, joinLimit, workbookPublishStatus, IWorkbookListData, IWorkbookSummaryData,
  IWorkbookFormAdd, IWorkbookFormEdit } from '../types';
import type { IExerciseBookRelTeacherDTO } from 'definitions/api/owl/pc/ExerciseBookFacade/getExerciseBookDetail';
import { IExerciseJoinSettingCommand } from 'definitions/api/owl/pc/ExerciseBookFacade/findPageByCondition';

/**
 * 作业本
 */
export default class Workbook {
  id: number | null;
  alias: string;
  title: string; // 作业本名称
  joinType: IWorkbookJoinType;
  needInfoCollect: BooleanLike;
  infoCollect?: {
    open?: BooleanLike;
    attributeIds: number[];
    inClue: BooleanLike;
  };
  teacherList: IExerciseBookRelTeacherDTO[];
  visibleOccasion: visibleOccasionType;
  visibleRange: visibleRangeType;
  status: workbookPublishStatus;
  createdAt: string;
  kdtId: number;
  assignmentNum: number;
  joinStudentNum: number;
  submitStudentNum: number;
  awaitMarkingNum: number;
  studentNum: number;
  subNum: number;
  submitRate: string;
  joinSetting: IExerciseJoinSettingCommand;

  constructor(workbook: Record<string, any>) {
    this.id = workbook?.id || null;
    this.alias = workbook?.alias || '';
    this.title = workbook?.title || '';
    this.joinType = workbook?.joinType || { type: joinLimit.freeToJoin };
    this.needInfoCollect = workbook?.needInfoCollect ?? BooleanLike.False;
    this.infoCollect = workbook?.infoCollect;
    this.teacherList = workbook?.teacherList || [];
    this.visibleOccasion = workbook?.visibleOccasion ?? visibleOccasionType.submitted;
    this.visibleRange = workbook?.visibleRange ?? visibleRangeType.all;
    this.status = workbook?.status ?? workbookPublishStatus.offStock;
    this.createdAt = workbook?.createdAt || '';
    this.kdtId = workbook?.kdtId || _global.kdtId;
    this.assignmentNum = workbook?.assignmentNum ?? 0;
    this.joinStudentNum = workbook?.joinStudentNum ?? 0;
    this.submitStudentNum = workbook?.submitStudentNum ?? 0;
    this.awaitMarkingNum = workbook?.awaitMarkingNum ?? 0;
    this.studentNum = workbook?.studentNum ?? 0;
    this.subNum = workbook?.subNum ?? 0;
    this.submitRate = workbook?.submitRate ?? '0';
    this.joinSetting = workbook?.joinSetting;
  }

  getCreatedTime() {
    return this.createdAt ? format(this.createdAt, 'YYYY-MM-DD HH:mm:ss') : '-';
  }

  getSubmitRate() {
    return this.submitRate + '%';
  }

  getListData(): IWorkbookListData | undefined {
    if (this.id) {
      return {
        id: this.id,
        alias: this.alias,
        kdtId: this.kdtId,
        title: this.title,
        assignmentNum: this.assignmentNum,
        joinStudentNum: this.joinStudentNum,
        submitStudentNum: this.submitStudentNum,
        teacherList: this.teacherList,
        createdAt: this.getCreatedTime(),
        status: this.status,
        joinSetting: this.joinSetting,
      };
    }
  }

  getPayloadForAdd(): IWorkbookFormAdd {
    return {
      title: this.title,
      joinType: this.joinType,
      needInfoCollect: this.needInfoCollect,
      infoCollect: this.infoCollect,
      teacherList: this.teacherList,
      visibleOccasion: this.visibleOccasion,
      visibleRange: this.visibleRange,
    };
  }

  getPayloadForEdit(): IWorkbookFormEdit | undefined {
    if (this.id) {
      return {
        id: this.id,
        alias: this.alias,
        kdtId: this.kdtId,
        status: this.status,
        title: this.title,
        joinType: this.joinType,
        needInfoCollect: this.needInfoCollect,
        infoCollect: this.infoCollect,
        teacherList: this.teacherList,
        visibleOccasion: this.visibleOccasion,
        visibleRange: this.visibleRange,
      };
    }
  }

  getWorkbookSummaryData(): IWorkbookSummaryData {
    return {
      id: this.id,
      title: this.title,
      assignmentNum: this.assignmentNum,
      awaitMarkingNum: this.awaitMarkingNum,
      studentNum: this.studentNum,
      subNum: this.subNum,
      submitRate: this.getSubmitRate(),
      kdtId: this.kdtId,
    };
  }
}
