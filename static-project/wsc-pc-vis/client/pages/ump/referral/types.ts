import { RewardTypeEnum, IRewardItem } from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';

export enum BgTypeEnum {
  DEFAULT,
  CUSTOMIZE,
}

export enum DesignateTypeEnum {
  ALL = 1,
  PART = 2,
}

export enum ReferrerTypeEnum {
  PURCHASED_EVENT_GOODS,
  PURCHASED_STORE_GOODS,
  UNLIMITED,
}

export enum RefereeTypeEnum {
  UNPURCHASED_EVENT_GOODS,
  UNLIMITED,
  UNPURCHASED_STORE_GOODS,
}

export enum RewardSettingEnum {
  COMMISSION_REWARD,
  PHASED_REWARD,
}

export enum DistributorAddOnEnum {
  ON,
}

/** 活动状态 */
export enum EventStatus {
  NOT_STARTED = 1,
  PROCESS,
  ENDED,
  INVALID,
}

export enum CouponTypeEnum {
  /** 无码凭证活动（优惠券） */
  CARD = 7,
  /** 唯一码凭证活动 */
  UNIQUE_CODE = 9,
  /** 共享码凭证活动 */
  SHARED_CODE,
  /** 社区团购券 */
  GROUPBUY_CARD,
  /** 三方券 */
  THIRDPARTY_CARD,
  /** 兑换券 */
  EXCHANGE_CARD,
  /** 有赞客优惠券 */
  YOUZANKE_CARD,
}

export enum PreferentialTypeEnum {
  COUPON = 1,
  DISCOUNT_COUPON,
}

/** 分佣奖励类型 */
export enum CommissionType {
  /** 按固定金额 */
  FIXED_PRICE = 1,
  /** 按比例 */
  FIXED_RATIO = 0,
}

export interface IShopInfo {
  applicableCampusList: any[];
  applicableCampusType: number;
}
export interface IPhasedRewardItem {
  /** 助力人数 */
  helpCount: number;
  /** 奖励名称 */
  rewardName: string;
  /** 积分数量 */
  bonusPoint: number;
  /** 优惠券 */
  couponList: IRewardItem[];
  /** 赠品 */
  presentList: IRewardItem[];
  /** 阶梯号 */
  phaseNo?: number;
  /** 已勾选奖励内容项 - 非接口返回 */
  checked?: RewardTypeEnum[];
}

/** 创建活动 */
export interface ICreateActivityParams {
  /** 活动名称 */
  name: string;
  /** 开始时间 */
  startAt: number;
  /** 结束时间 */
  endAt: number;
  /** 商品id */
  goodsId: number;
  /** 活动背景图类型 */
  bgType: BgTypeEnum;
  /** 背景图url */
  bgUrl: string;
  /** 推荐人设置类型 0 仅购买过活动商品的客户(默认) 1 仅购买过店铺内商品的客户 2 不限制 */
  referrerType: ReferrerTypeEnum;
  /** 被推荐人设置类型 0 从未购买过活动商品的客户(默认) 1 不限制 2 从未购买过店铺商品的客户 */
  refereeType: RefereeTypeEnum;
  /** 分佣奖励类型 */
  commissionRewardType: CommissionType;
  /** 固定立减金额 */
  discountValue?: number;
  /** 固定佣金金额 */
  commissionValue?: number;
  /** 佣金折扣比 */
  commissionRate?: number;
  /** 立减折扣比 */
  discountRate?: number;
  /** 阶梯任务奖励 */
  phasedRewardDetails?: IPhasedRewardItem[],
  designatedKdtIds?: any[];
  /** 多网店店铺选择类型 1 是 all 2 是 part */
  designateType?: DesignateTypeEnum;
  /** 是否为阶梯奖励 */
  hasPhasedReward: boolean;
  /** 是否和销售员叠加 */
  hasDistributorAddOn: boolean;
  /** 是否有分佣奖励 */
  hasCommissionReward: boolean;
  shopInfo?: IShopInfo;
}

export interface IUpdateActivityParams extends ICreateActivityParams {
  id: number;
}

export interface IActivityDetail extends ICreateActivityParams {
  /** 佣金金额(分) */
  commissionPrice: number;
  /** 立减价格 */
  decreasePrice: number;
  /** 商品原价 */
  originalPrice: number;
  /** 活动状态 */
  status: EventStatus;
}

export interface IFormParams {
  /** 活动名称 */
  name: string;
  /** 活动时间 */
  time: string[];
  /** 课程选择 */
  courseSelect: any;
  /** 海报背景设置 */
  posterSelect: {
    /** 海报背景类型 */
    backgroundType: BgTypeEnum;
    /** 海报背景图 */
    backgroundUrl: string;
  },
  /** 被推荐人设置类型 */
  refereeType: RefereeTypeEnum;
  /** 推荐人设置类型 */
  referrerType: ReferrerTypeEnum;
  /** 奖励设置 */
  rewardSettings: RewardSettingEnum[];
  /** 分佣奖励类型 */
  commissionRewardType: CommissionType;
  /** 固定立减金额 */
  discountValue?: number;
  /** 固定佣金金额 */
  commissionValue?: number;
  /** 佣金折扣比 */
  commissionRate?: string;
  /** 立减折扣比 */
  discountRate?: string;
  /** 阶梯任务奖励 */
  phasedRewardDetails?: IPhasedRewardItem[],
  /** 优惠叠加 */
  distributorAddOn: DistributorAddOnEnum[];
  shopInfo?: IShopInfo;
}

export interface IGoodsSkuItem {
  id: number;
  price: number
}

export interface IRecommendRankDTO {
  /** 推荐人数 */
  recommendCount: number;
  /** 推荐人姓名 */
  oldCustomerName: string;
  /** 赠品数量 */
  presentCount: number;
  /** 带来的订单数 */
  orderCount: number;
  /** 优惠券数量 */
  couponCount: number;
  /** 推荐人id */
  oldCustomerId: number;
  /** 积分奖励 */
  totalBonusPoint: number;
  /** 推荐人手机号 */
  oldCustomerPhone: string;
  /** 佣金奖励 */
  totalRewardValue: number;
  /** 名次 */
  rankNo: number;
}

export interface IRecommendRewardDTO {
  /** 老客用户id */
  oldCustomerUserId: number
  /** 订单号 */
  orderNo: string
  /** 老客昵称 */
  oldCustomerName: string
  /** 商品ID */
  goodsId: number
  /** 新客id */
  newCustomerUserId: number
  /** 新客手机号 */
  newCustomerPhone: string
  /** 新客昵称 */
  newCustomerName: string
  /** 佣金金额 */
  commissionValue: number
  /** 奖励发放时间 */
  rewardTime: number
  /** 新客所属校区 */
  newCustomerShopName: string
  /** 商品价格 */
  goodsPrice: number
  /** 新客立减金额 */
  discountValue: number
  /** 老客手机号 */
  oldCustomerPhone: string
  /** 商品信息 */
  goodsName: string
}

export interface ISummaryData {
  /** 活动浏览人数 */
  activityUv: number;
  /** 活动浏览次数 */
  activityPv: number;
  /** 累计发放积分数 */
  bonusPoint: number;
  /** 累计发放佣金(分) */
  commissionSum: number;
  /** 累计发放优惠券数 */
  couponCount: number;
  /** 累计被推荐人折扣金额(分) */
  discountSum: number;
  /** 累计支付订单数 */
  orderCount: number;
  /** 累计支付订单金额(分) */
  orderAmount: number;
  /** 累计发放赠品数 */
  presentCount: number;
  /** 推荐人参与数 */
  refererCount: number;
  /** 被推荐人参与数 */
  refereeCount: number;
}

export interface IActivityAwardProps {
  id?: string;
  disabled: boolean;
  disableGoods: boolean;
}
