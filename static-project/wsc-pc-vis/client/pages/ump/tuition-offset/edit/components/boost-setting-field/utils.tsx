import React from 'react';
import { FormError } from 'zent';
import get from 'lodash/get';
import { PhaseOneNeedBoost } from '../../types';
import { IBoostDetail, BoostFieldErrorType, IBoostSelectData } from './types';

export const toggleSwitch = (list: IBoostDetail[], type: PhaseOneNeedBoost) => {
  const phaseOne = list[0];
  if (type === PhaseOneNeedBoost.noNeed) {
    list.splice(0, 1, {
      ...phaseOne,
      helpCnt: 0,
    });
    if (list.length === 1) { // 如果在需要助力时删掉一行，再选择"无需助力"
      list.push({
        phaseNo: 2,
      });
    }
  } else {
    list.splice(0, 1, {
      ...phaseOne,
      helpCnt: null,
    });
  };
  return list;
};

export const boosterNumberErrorParser = (phaseNo, current, enableNoBoost, sortedDetail) => {
  if (enableNoBoost === PhaseOneNeedBoost.noNeed && phaseNo <= 1) {
    return null;
  }
  const previousBoosterNumber = get(sortedDetail[phaseNo - 2], 'helpCnt', 0);
  const currentBoosterNumber = Number(current || 0);
  if (Number(currentBoosterNumber) === 0) {
    return <FormError>{BoostFieldErrorType.emptyBoosterNumber}</FormError>;
  }

  if (Number(currentBoosterNumber) <= Number(previousBoosterNumber)) {
    return <FormError>{BoostFieldErrorType.insufficientBoosterNumber}</FormError>;
  }

  if (Number(currentBoosterNumber) > 999) {
    return <FormError>{BoostFieldErrorType.boosterNumberTooLarge}</FormError>;
  }
};

export const couponAmountErrorParser = (phaseNo, current, sortedDetail) => {
  const previousCouponAmount = get(sortedDetail[phaseNo - 2], 'amount', 0);
  if (Number(current) === 0 && phaseNo === 1) { // 真的为0
    return <FormError>{BoostFieldErrorType.invalidFirstCouponAmount}</FormError>;
  }
  const currentCouponAmount = Number(current || 0);
  if (Number(currentCouponAmount) === 0) {
    return <FormError>{BoostFieldErrorType.emptyCouponAmount}</FormError>;
  }

  if (Number(currentCouponAmount) <= Number(previousCouponAmount)) {
    return <FormError>{BoostFieldErrorType.insufficientCouponAmount}</FormError>;
  }

  if (Number(currentCouponAmount) > 99999.99) {
    return <FormError>{BoostFieldErrorType.couponAmountTooLarge}</FormError>;
  }
};

export const boostSelectValidator = (value: IBoostSelectData) => {
  const { enableNoBoost, boostDetail = [] } = value;
  for (let i = 0; i < boostDetail.length; i++) {
    if (!Number(boostDetail[i].helpCnt) || !Number(boostDetail[i].amount)) {
      if (!Number(boostDetail[i].helpCnt) &&
        enableNoBoost === PhaseOneNeedBoost.noNeed &&
        boostDetail[i].phaseNo === 1) {
        continue;
      }
      return {
        name: 'field not empty',
        message: '助力人数和学费金额非空',
      };
    }

    if (i > 0 &&
      (Number(boostDetail[i].helpCnt || 0) <= Number(boostDetail[i - 1].helpCnt || 0) ||
      Number(boostDetail[i].amount || 0) <= Number(boostDetail[i - 1].amount || 0))) {
      return {
        name: 'field value should be greater than the previous one',
        message: '数值需要大于上一级',
      };
    }

    return null;
  }
};
