import { IExerciseInfoCollectDTO, IExerciseJoinSettingDTO, IStudentBriefDTO, IUserExerciseDTO } from 'definitions/api/owl/api/UserExerciseFacade/getUserExercise';

/** 加入方式枚举 */
export enum JoinTypeEnum {
  /** 自由加入 */
  FREE = 1,
  /** 关联班级 */
  CLASS = 2,
}

/** 媒体类型枚举 */
export enum MediaTypeEnum {
  /** 富文本(图文) */
  RICH_TEXT = 1,
  /** 图片 */
  IMAGE = 2,
  /** 音频 */
  AUDIO = 3,
  /** 视频 */
  VIDEO = 4
}

/** 上下架类型枚举 */
export enum ShelfTypeEnum {
  ON_SHELF=1,
  OFF_SHELF=2,
}

export class WorkbookDetailEntity {
  origin: IUserExerciseDTO;
  /** 加入方式设置 */
  joinSetting: IExerciseJoinSettingDTO;
  /** 作业总数 */
  homeworkNum: number;
  /** 店铺id */
  kdtId: number;
  /** 加入时间 */
  joinTime: string;
  /** 学员信息 */
  studentList: Array<IStudentBriefDTO>;
  /** 作业本alias */
  alias: string;
  /** 作业本id */
  id: number;
  /** 作业本标题 */
  title: string;
  /** 信息采集 */
  infoCollect: IExerciseInfoCollectDTO;
  /**
   * 作业本的状态
   *  1：上架
   *  2：下架
   */
  status: number;
  constructor(data: IUserExerciseDTO) {
    this.origin = data;
    this.title = data.title;
    this.joinSetting = data.joinSetting;
    this.homeworkNum = data.homeworkNum;
    this.kdtId = data.kdtId;
    this.joinTime = data.joinTime;
    this.studentList = data.studentList;
    this.alias = data.alias;
    this.id = data.id;
    this.infoCollect = data.infoCollect;
    this.status = data.status;
  }

  /** 是否已加入 */

  get hasJoined() {
    return Boolean(this.origin.ownAsset);
  }

  /** 是否能自由加入 */

  get isFreeJoin() {
    return this.joinSetting.joinType === JoinTypeEnum.FREE;
  }

  /** 是否是通过关联班级加入 */

  get isCLassJoin() {
    return this.joinSetting.joinType === JoinTypeEnum.CLASS;
  }

  /** 是否需要信息采集 */

  get isNeedInfoCollect() {
    return Boolean(this.infoCollect.open);
  }

  /** 是否上架 */

  get isOnShelf() {
    return this.status === ShelfTypeEnum.ON_SHELF;
  }

  /** 是否下架 */

  get isOffShelf() {
    return this.status === ShelfTypeEnum.OFF_SHELF;
  }
}
