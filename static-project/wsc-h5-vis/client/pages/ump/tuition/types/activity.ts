import { IBaseUserInfo } from './user';

/** 一个助力阶段 */
export interface IBoostPhase {
  amount: number;
  helpCnt: number;
  phaseNo: number;
}

/** 活动状态 */
export enum TemplateStatus {
  /** 未开始 */
  NOT_STARTED,
  /** 进行中 */
  PROCESSING,
  /** 已结束 */
  OVER,
  /** 已失效 */
  EXPIRED
}

export enum InstanceProgressStatus {
  PROCESSING = 1,
  FULL
}

export interface IPaidOrderInfo {
  goodsAlias: string;
  goodsUrl:string;
  goodsId: number;
  goodsPrice:number;
  goodsName: string;
  orderNo:string;
  verifiedTuitionAmount:number;
}

/** 攒学费活动实例 */
export interface IInstanceInfo {
  /** 发起活动的时间 */
  participateTime: string;
  /** 发起人信息 */
  user: IBaseUserInfo;
  /** 已攒学费 */
  tuitionAmount: number;
  /** 下一阶段的信息 */
  nextPharseInfo: IBoostPhase;
  /** 发起人用户id */
  ownerUserId: number;
  /** 本次实例id */
  id: number;
  /** 实例状态 */
  instanceStatus: InstanceStatus;
  /** 集赞进行状态 */
  progressStatus: InstanceProgressStatus;
  /** 已兑换的订单信息, 目前一次活动只能一次订单优惠 */
  paidOrderInfo: IPaidOrderInfo;
}

/** 攒学费活动模版信息 */
export interface ITemplateInfo {
  bgType?: number;
  name?: string;
  id: number;
  /** 活动的 alias */
  alias: string;
  /** 活动开始时间 */
  startAt: number;
  /** 活动结束时间 */
  endAt: number;
  /** 助力的阶段信息 */
  helpPhases: IBoostPhase[];
  status: TemplateStatus;
  /** 最高的那个助力阶段 */
  highestPhase: IBoostPhase;
  /** 最低的哪个助力阶段 */
  lowestPhases: IBoostPhase;
  /** 是否需要信息采集 */
  needCollectInfo?: boolean;
}

/** 活动实例状态 */
export enum InstanceStatus {
  /** 进行中 */
  PROCESSING = 1,
  /** 冻结中（使用学费兑换了课程，下单了没有支付） */
  FREEZING = 2,
  /** 已兑换 */
  REDEEMED = 3
}
