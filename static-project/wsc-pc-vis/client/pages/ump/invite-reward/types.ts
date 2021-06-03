/** 活动状态 */
export enum ActivityStatus {
  /** 全部 */
  all = -1,
  /** 未开始 */
  notStarted = 0,
  /** 进行中 */
  ongoing = 1,
  /** 已结束 */
  ended = 2,
  /** 已失效 */
  invalid = 3,
}

/** 线索状态 */
export enum ClueStates {
  /** 默认态 */
  defaultState = 0,
  /** 待分配 */
  toBeAssigned = 1,
  /** 待跟进 */
  toBeFollowedUp = 2,
  /** 跟进中(待邀约) */
  followUp = 3,
  /** 已邀约(待试听) */
  invited = 4,
  /** 已试听 */
  auditioned = 5,
  /** 已成交 */
  completed = 6,
  /** 放弃线索 */
  abandoned = 7,
  /** 删除线索 */
  deleted = 8,
  /** 永久删除 */
  permanentlyDeleted = 20,
}

/** 新学员奖励设置 */
export enum NewStudentRewardSettingType {
  /** 无门槛领取奖励 */
  noRule = 1,
  /** 新学员分享活动后 */
  share = 2,
  /** 新学员获得好友能量后 */
  friendHelp = 3,
}

export enum NewStudentRewardDisplaySettingType {
  priceAndTitle,
  onlyTitle,
  rewardDesc
}

export enum OldStudentSettingType {
  /** 1：购买过课程的学员 */
  potential = 1,
  /** 2：当前在读学员 */
  official = 2,
  /** 0: 不限制 */
  unlimit = 0
}

export enum NewStudentSettingType {
  /** 1：线索池中不存在的线索 */
  notInCluepool = 1,
  /** 2：未到店试听过的线索 */
  notTrialed = 2,
  /** 3：未购买正式课的线索 */
  notPurchased = 3,
}

export type posterStyleType = 1 | 2 | 3;

/** 活动列表数据 */
export interface ActivityListData {
  /** 转介绍学员数 */
  newStudentJoinNum: number;
  /** 老学员参与数 */
  oldStudentJoinNum: number;
  /** 活动名称 */
  name: string;
  /** 老学员奖励(说明) */
  oldStudentRewardRuleDesc: string;
  /** 活动id */
  id: number;
  /** 活动结束时间 */
  endAt: number;
  /** 活动开始时间 */
  startAt: number;
  /** 活动状态  0未开始，1进行中，2已结束，3已失效 */
  status: number;
  /** 活动alias */
  alias: string;
  /** 适用校区 */
  designateType: number;
  /** 是否为老数据 */
  isOldStruct: boolean;
}

interface INewStudentInfoCollectSetting {
  /** 资料项id */
  attributeIds: number[];
  /** 是否需要手机验证码 */
  needVerifyCode: number;
}

export enum AwardTypeEnum {
  POINT = 1,
  COUPON,
  PRESENT
};
export interface AwardItem {
  awardBizId: number;
  awardAmount: number;
  type: AwardTypeEnum
}

export interface AwardDesc {
  awardValueDesc: string;
  awardTotalValue: number;
  descriptionMode: number;
  freestyleDesc: string;
}
export interface StudentAwardSetting {
  awards:AwardItem[];
  awardDesc:AwardDesc;
  awardNode: number;
}
interface IInviteRewardRuleSetting {
  /** 新学员奖励设置类型  1-无门槛, 2-分享活动, 3-好友助力 */
  newStudentRewardSettingType: number;
  /** 活动门槛为好友助力时，需要的好友人数 */
  friendHelpTotalNum: number;
  /** 老学员设置 */
  oldStudentRule: OldStudentSettingType,
  /** 老学员奖励规则(说明)  --- 兼容老数据 */
  oldStudentRewardRuleDesc?: string;
  /** 老学员奖励规则（新） */
  oldStudentAwards: StudentAwardSetting[];

  /** 新学员设置 */
  newStudentRule: NewStudentSettingType,

  /** 信息采集设置项 */
  newStudentInfoCollectSetting: INewStudentInfoCollectSetting;
  /** 新学员奖励设置 */
  newStudentAward: StudentAwardSetting;
}

export interface IAdvancedSetting {
  /** 活动页风格 */
  pageStyle: number;
  /** 活动页是否展示推荐商品 */
  showRecommendGoods: number;
  /** 老学员海报 */
  oldStudentPosterSetting: number[];
  /** 自定义海报 */
  customizePosters: string[];
  /** 活动规则 */
  activityRuleDesc: string;
}

interface IInviteRewardBaseInfoSetting {
  /** 转介绍活动名称 */
  name: string;
  /** 转介绍活动结束时间 */
  endAt: String;
  /** 转介绍活动开始时间 */
  startAt: string;
}

export interface INewStudentPageSetting {
  /** 机构介绍 */
  organizationDesc: string;
  /** 显示参加人数 */
  showJoinNum: ShowJoinNum;
}

interface IInviteRewardDetailDTO {
  /** 活动规则设置 */
  ruleSetting: IInviteRewardRuleSetting;
  /** 活动id */
  id?: number;
  /** 高级设置 */
  advanceSetting: IAdvancedSetting;
  newStudentPageSetting: INewStudentPageSetting;
  /** 活动基本信息设置 */
  baseInfoSetting: IInviteRewardBaseInfoSetting;
}

/** 创建/编辑活动数据 */
export interface IInviteRewardCreateCommand {
  copy: 0 | 1;
  introductionInfo: IInviteRewardDetailDTO
}

export enum oldStudentPoster {
  default = 1,
  custom = 2,
}

export enum ActivityVersion {
  zero,
  one,
  two
};

/** 是否展示活动参与人数 */
export enum ShowJoinNum {
  /** 否 */
  FALSE = 0,
  /** 是 */
  TRUE,
}
