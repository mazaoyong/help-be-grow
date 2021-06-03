import { getZanDetail as fetchZanDetail } from './apis';
import { IZanDetail, ICollectZanGivingRecordDTO } from 'definitions/api/owl/ump/CollectZanFacade/getZanSetDetail';
import { get } from 'lodash';

export enum ZanStatus {
  PROMOTION_END,
  COURSE_INVALID,
  PROCESSING,
  COMPLETED,
}

export function getZanDetail(zanAlias: string) {
  return fetchZanDetail({
    zanSetAlias: zanAlias,
  });
}

/**
 * 确定好友助力活动状态
 *
 * @param {IZanDetail} zanDetail 当前活动详情
 * @return {ZanStatus}
 */
export function getZanStatus(zanDetail: IZanDetail) {
  const {
    isDelete,
    processState,
    couponStock,
    skuStock: {
      stock: courseStock = 0,
    } = {},
  } = zanDetail.collectZan || {};
  const { status } = zanDetail.zanSet || {};

  // 活动已达标
  if (status === 1) {
    return ZanStatus.COMPLETED;
  }

  // 已失效/已删除/活动未开始/活动已结束
  // 都视为活动已结束
  if (isDelete || processState !== 1) {
    return ZanStatus.PROMOTION_END;
  }

  // 课程/优惠券没库存了
  if ((isCourseReward(zanDetail) && !courseStock) ||
    (isCouponReward(zanDetail) && !couponStock)
  ) {
    return ZanStatus.COURSE_INVALID;
  }

  // 未删除 + 进行中
  if (!isDelete && processState === 1) {
    return ZanStatus.PROCESSING;
  }

  return ZanStatus.PROMOTION_END;
}

/**
 * 确定活动奖励是不是免费领取课程
 *
 * @param {IZanDetail} zanDetail 当前活动详情
 * @return {boolean}
 */
export function isCourseReward(zanDetail: IZanDetail): boolean {
  return get(zanDetail, 'collectZan.prizeChannel', 0) === 0;
}

/**
 * 确定活动奖励是不是优惠券
 *
 * @param {IZanDetail} zanDetail 当前活动详情
 * @return {boolean}
 */
export function isCouponReward(zanDetail: IZanDetail): boolean {
  return get(zanDetail, 'collectZan.prizeChannel', 0) === 1;
}

/**
 * 获取活动达标还需要的助力数量
 *
 * @param zanDetail
 * @return {number}
 */
export function getRemainCount(zanDetail: IZanDetail): number {
  const {
    collectZan = { collectNum: 0 },
    givingZanRecordList = [],
  } = zanDetail;

  return collectZan.collectNum! - givingZanRecordList.length;
}

/**
 * 获取活动达标需要的助力总数量
 *
 * @param zanDetail
 * @return {number}
 */
export function getTotalCount(zanDetail: IZanDetail): number {
  return get(zanDetail, 'collectZan.collectNum', 0);
}

/**
 * 判断用户是不是发起人
 *
 * @param zanDetail
 * @return {boolean}
 */
export function isBuilder(zanDetail: IZanDetail): boolean {
  return get(zanDetail, 'zanSetUserStatus.isBuilder');
}

/**
 * 获取倒计时时间 ms
 *
 * @param zanDetail
 */
export function getCountDownMS(zanDetail: IZanDetail): number {
  let dateStr = get(zanDetail, 'collectZan.endAt', 0);
  if (dateStr) dateStr = dateStr.replace(/-/g, '/');
  return new Date(dateStr).getTime() - Date.now();
}

export function getRecordList(zanDetail: IZanDetail): ICollectZanGivingRecordDTO[] {
  return get(zanDetail, 'givingZanRecordList', [] as any);
}

export function getCouponInfo(zanDetail: IZanDetail): any {
  return get(zanDetail, 'collectZan.couponInfo', {});
}

export function getHasSupported(zanDetail: IZanDetail): boolean {
  return get(zanDetail, 'zanSetUserStatus.isGiving');
}
