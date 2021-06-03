import type {
  IPageRequest,
  IExerciseBookPageQuery,
  IExerciseJoinSettingCommand,
} from 'definitions/api/owl/pc/ExerciseBookFacade/findPageByCondition';
import type { IExerciseBookRelTeacherDTO } from 'definitions/api/owl/pc/ExerciseBookFacade/getExerciseBookDetail';

export interface IWorkbookListQuery {
  query: IExerciseBookPageQuery;
  pageRequest: IPageRequest;
}

export interface IWorkbookDetailQuery {
  id: number;
}

export interface IWorkbookSummaryQuery {
  exerciseBookId: number;
}

export enum BooleanLike {
  False = 0,
  True,
}

export interface IWorkbookFormAdd {
  title: string; // 作业本名称
  joinType: IWorkbookJoinType;
  needInfoCollect: BooleanLike;
  infoCollect?: {
    attributeIds: number[];
    inClue: BooleanLike;
  };
  teacherList: IExerciseBookRelTeacherDTO[];
  visibleOccasion: visibleOccasionType;
  visibleRange: visibleRangeType;
}

export interface IWorkbookFormEdit extends IWorkbookFormAdd {
  id: number;
  alias: string;
  kdtId?: number;
  status: workbookPublishStatus;
}

export type IWorkbookFormData = IWorkbookFormAdd | IWorkbookFormEdit;

/**
 * 作业本上架状态，上架操作枚举
 */
export enum workbookPublishStatus {
  /** 上架 */
  inStock = 1,
  /** 下架 */
  offStock,
}

// // 详情
// interface IWorkbookDetailBase {
//   order: number;
// }

// interface IWorkbookRichtext extends IWorkbookDetailBase {
//   type: workbookDetailElement.richText;
//   detail: {
//     text?: string;
//   }
// }

// interface IWorkbookAudio extends IWorkbookDetailBase {
//   type: workbookDetailElement.audio;
//   detail: {
//     name?: string;
//     url?: string;
//   }
// }

// interface IWorkbookVideo extends IWorkbookDetailBase {
//   type: workbookDetailElement.video;
//   detail: {
//     name?: string;
//     url?: string;
//   }
// }

// export type IWorkbookDetail = IWorkbookRichtext | IWorkbookAudio | IWorkbookVideo;

// enum workbookDetailElement {
//   richText = 1,
//   audio = 3,
//   video,
// }

// 加入方式
export enum joinLimit {
  freeToJoin = 1,
  boundClass,
}

interface IWorkbookJoinBase {}

interface IWorkbookFreeToJoin extends IWorkbookJoinBase {
  type: joinLimit.freeToJoin;
}

interface IWorkbookBoundClass extends IWorkbookJoinBase {
  type: joinLimit.boundClass;
  educlass: {
    className: string;
    classId: number;
  };
}

export type IWorkbookJoinType = IWorkbookFreeToJoin | IWorkbookBoundClass;

/**
 * 学员可查看其他人作业的时机
 */
export enum visibleOccasionType {
  /** 作业提交后可查看他人作业 */
  submitted = '1',
  /** 作业被批阅后可查看他人作业 */
  marked = '2',
}

/**
 * 学员查看其他作业的范围
 */
export enum visibleRangeType {
  /** 用户可查看其他人提交的所有作业 */
  all = '1',
  /** 用户仅能查看被选为优秀作业的作业 */
  goodOnesOnly = '2',
}

export enum instockStatusFilterType {
  /** 全部 */
  all = 0,
  /** 已上架 */
  inStock,
  /** 下架 */
  outOfStock,
}

export interface IWorkbookListData {
  id: number;
  kdtId: number;
  alias: string;
  title: string;
  assignmentNum: number;
  joinStudentNum: number;
  submitStudentNum: number; // 已提交作业的人数
  teacherList: IExerciseBookRelTeacherDTO[];
  createdAt: string;
  status: workbookPublishStatus;
  joinSetting: IExerciseJoinSettingCommand;
}

export interface IWorkbookSummaryData {
  assignmentNum: number;
  awaitMarkingNum: number;
  id?: number | null;
  title: string;
  studentNum: number;
  subNum: number;
  submitRate: string;
  kdtId?: number;
}

export interface IWorkbookRelClassPageDTO {
  title: string;
  workbookId: number;
}

export interface IExerciseRewardType {
  awardAmount: number | null,
  type: number,
  awardBizId: string
}

export interface IExerciseRewardItem {
  awardNode: number,
  awardList: Array<IExerciseRewardType>,
}

export type IExerciseRewardArray = Array<IExerciseRewardItem>

export interface IExerciseRewardDTO {
  awardData: IExerciseRewardArray
}

export interface IExerciseRewardTableData {
  awardNode?: number,
  awardAmount: number | null,
  type: number,
  id?: string,
  awardBizId: string
}

export type IExerciseRewardTableDTO = Array<IExerciseRewardTableData>
