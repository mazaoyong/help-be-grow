/* eslint-disable jsdoc/require-returns */
import HomeworkStudent from '@/domain/student-domain/entities/homeworkStudent';
import { IExerciseBookRelTeacherDTO } from 'definitions/api/owl/api/UserExerciseFacade/getHomeworkDetail';
import { IExerciseInfoCollectDTO, IExerciseJoinSettingDTO, IStudentBriefDTO } from 'definitions/api/owl/api/UserExerciseFacade/getUserExercise';

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

/** 作业本加入设置-班级数据 */
export interface IClassJoinData {
  /** 班级id */
  classId: number;
  /** 班级名称 */
  name: string;
}

/** 作业本加入设置 */
export interface IJoinSetting {
  /** 与加入方式相关的一些数据 */
  data?: IClassJoinData;
  /** 加入方式 */
  joinType: JoinTypeEnum;
}

/** 信息采集 */
export interface IInfoCollect {
  /** 信息采集项 */
  attributeIds: number[];
  /** 是否进入线索 */
  isInClue: boolean;
  /** 是否开启信息采集 */
  isOpen: boolean;
}

/** 富文本详情 */
export interface IRichTextDetail {
  content: string;
}

/** 音频详情 */
export interface IAudioDetail {
  /** 音频链接 */
  url: string;
  /** 音频大小 */
  size: number;
  /** 音频名称 */
  name: string;
}

/** 视频详情 */
export interface IVideoDetail {
  id: number;
}

/** 图片详情 */
export interface IImageDetail {
  /** 图片地址 */
  url: string;
}

/** 媒体块 */
export interface IMediaBlock {
  /** 详情 */
  detail: IRichTextDetail | IAudioDetail | IVideoDetail | IImageDetail;
  /** 类型 */
  mediaType: MediaTypeEnum;
  /** 媒体序号 */
  serialNo: number;
}

/** 学员查看其他学员作业的时机 */
export enum StudentViewOtherHomeworkChanceEnum {
  /** 作业提交后可查看他人作业 */
  AFTER_COMMIT = 1,
  /** 作业被批阅后可查看他人作业 */
  AFTER_CORRECT = 2
}

/** 学员查看其他学员作业的范围 */
export enum StudentViewOtherHomeworkScopeEnum {
  /** 所有作业 */
  ALL = 1,
  /** 优秀作业 */
  EXCELLENT = 2
}

export interface IStudentViewSetting {
  /** 学员查看其他学员作业的时机 */
  chance: StudentViewOtherHomeworkChanceEnum;
  /** 学员查看其他学员作业的范围 */
  scope: StudentViewOtherHomeworkScopeEnum;
}

export interface IWorkbookTeacher {
  id: number;
  /** 姓名 */
  name: string;
  /** 序号 */
  serialNo: number;
}

export interface IAwardList {
  awardBizId: string,
  awardAmount: number | null,
  type: number,
  awardNode?: number
}

export interface IRewardArray {
  awardNode: number,
  awardList: Array<IAwardList>
}

export interface IRewardDTO {
  awardData: Array<IRewardArray>
}

/**
 * 聚合了几个关于作业本的接口
 * http://zanapi.qima-inc.com/site/service/view/1008488
 * http://zanapi.qima-inc.com/site/service/view/1004119
 *
 * 一些无用的值没有被加入！！！
 *
*/
interface IWorkbook {
  /**
   * 学员查看其他人作业的方式
   *  1：作业提交后可查看他人作业
   *  2：作业被批阅后可查看他人作业
   */
  studentViewOtherWorkType?: number;
  /**
   * 学员查看作业的范围
   *  1： 用户可查看其他人提交的所有作业
   *  2： 用户仅能查看被选为优秀作业的作业
   */
  studentViewWorkScope?: number;
  /** 加入方式设置 */
  joinSetting?: IExerciseJoinSettingDTO;
  /** 店铺id */
  kdtId: number;
  /** 作业本alias */
  alias: string;
  /** 关联的老师 */
  teacherList?: Array<IExerciseBookRelTeacherDTO>;
  /** 作业本id */
  id: number;
  /** 作业本标题 */
  title: string;
  /** 信息采集 */
  infoCollect?: IExerciseInfoCollectDTO;
  /**
   * 作业本的状态
   *  1：上架
   *  2：下架
   */
  status?: number;
  /** 学员信息 */
  student?: IStudentBriefDTO;
  studentList?: Array<IStudentBriefDTO>;
  studentDTO?: IStudentBriefDTO;
  /** 是否已加入 */
  hasJoined?: boolean;
  /** 作业总数 */
  homeworkNum?: number;
  /** 加入时间 */
  joinTime?: string;
  /** 是否已加入作业本 */
  ownAsset?: boolean;
  /** 奖励规则 */
  reward?: IRewardDTO;
}

/** 作业本 */
export default class Workbook {
  /** 原始数据 */
  workbook: IWorkbook;
  /** id */
  id: number;
  /** 别称 */
  alias: string;
  /** 标题 */
  title: string;
  /** 作业数量 */
  homeworkCount: number;
  /** 上下架状态 1：上架 2：下架 */
  status: number;
  /** 加入方式设置 */
  joinSetting: IJoinSetting;
  /** 信息采集 */
  infoCollect: IExerciseInfoCollectDTO;
  /** 当前作业本学员 */
  studentList: HomeworkStudent[];
  /** 学员查看其他同学作业的设置 */
  studentViewSetting: IStudentViewSetting;
  /** 关联的老师信息 */
  teacherList: IWorkbookTeacher[];
  /** 所属店铺kdt_id */
  targetKdtId: number;
  /** 奖励规则 */
  reward?: IRewardDTO;

  constructor(workbook: IWorkbook) {
    this.workbook = workbook;
    this.id = workbook.id;
    this.alias = workbook.alias;
    this.title = workbook.title;
    this.homeworkCount = workbook?.homeworkNum || 0;
    this.status = workbook?.status || 2;
    this.joinSetting = workbook?.joinSetting as unknown as IJoinSetting || { joinType: 1 };
    this.infoCollect = workbook?.infoCollect || { attributeList: [], open: 0, inClue: 0 };
    this.reward = workbook?.reward;
    if (workbook?.studentList && Array.isArray(workbook.studentList)) {
      this.studentList = workbook.studentList.map((student) => new HomeworkStudent({ ...student }));
    } else if (workbook?.student) {
      this.studentList = [new HomeworkStudent({ ...(workbook.student as IStudentBriefDTO) })];
    } else if (workbook?.studentDTO) {
      this.studentList = [new HomeworkStudent({ ...(workbook.studentDTO as IStudentBriefDTO) })];
    } else {
      this.studentList = [];
    }
    this.studentViewSetting = {
      chance: workbook.studentViewOtherWorkType || StudentViewOtherHomeworkChanceEnum.AFTER_CORRECT,
      scope: workbook.studentViewWorkScope || StudentViewOtherHomeworkScopeEnum.EXCELLENT,
    };
    this.teacherList = workbook?.teacherList?.map((teacher) => {
      return {
        id: teacher.teacherId,
        name: teacher.name,
        serialNo: teacher.serialNo,
      };
    }) || [];
    this.targetKdtId = workbook.kdtId;
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
    return this.infoCollect.open;
  }

  /** 是否上架 */
  get isOnShelf() {
    return this.status === 1;
  }

  get hasJoined() {
    return Boolean(this.workbook.ownAsset);
  }
}
