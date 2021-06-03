import { PhaseOneNeedBoost } from '../../types';

export enum BoostFieldType {
  boosterNumber = 'helpCnt', // 助力人数
  couponAmount = 'amount', // 学员可领学费
};

export enum BoostFieldErrorType {
  emptyBoosterNumber = '请设置助力人数',
  insufficientBoosterNumber = '需大于上一阶段人数',
  emptyCouponAmount = '请输入学费金额',
  insufficientCouponAmount = '需大于上一阶段学费金额',
  invalidFirstCouponAmount = '学费金额需大于0',
  boosterNumberTooLarge = '助力人数最多为999',
  couponAmountTooLarge = '学费金额最高为99999.99',

};

export interface IBoostDetail {
  amount?: number | null;
  helpCnt?: number | null;
  phaseNo: number;
};

export interface IBoostSelectData {
  enableNoBoost: PhaseOneNeedBoost;
  boostDetail: IBoostDetail[];
};
