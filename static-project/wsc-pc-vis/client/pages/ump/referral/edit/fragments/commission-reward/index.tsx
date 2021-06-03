import React, { FC } from 'react';
import { Radio, FormNumberInputField, FormRadioGroupField, FormError } from 'zent';
import isNil from 'lodash/isNil';
import number from '@youzan/utils/number';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import { FIXED_RATIO_PROPS, FIXED_PRICE_PROPS } from '../../../constants';
import { IActivityAwardProps, RewardSettingEnum, CommissionType } from '../../../types';
import { checkGoodsPriceEqualsZero } from '../../utils';

const { accSub, accMul, accDiv } = number;

const CommissionError: FC = () => {
  return <FormError>0元课程不支持设置分佣奖励，需取消分佣奖励或选择其他活动商品。</FormError>;
};

export const getCommissionReward: (props: IActivityAwardProps) => IFormCreatorConfig[] = (props) => {
  const { disabled } = props;

  return [
    // 分佣奖励 START
    {
      name: 'commissionRewardType',
      type: 'field',
      className: 'commission-type',
      component: FormRadioGroupField,
      withoutLabel: true,
      children: [
        {
          component: (
            <>
              <Radio value={CommissionType.FIXED_PRICE}>按固定金额</Radio>
              <Radio value={CommissionType.FIXED_RATIO}>按比例</Radio>
            </>
          )
        }
      ],
      show: {
        dep: 'rewardSettings',
        fn: (rewardSettings) =>
          (rewardSettings || []).includes(RewardSettingEnum.COMMISSION_REWARD),
      },
      defaultValue: CommissionType.FIXED_PRICE,
      props: () => ({
        props: {
          disabled,
        },
      }),
    },
    {
      label: '被推荐人下单优惠：',
      name: 'discountValue',
      className: 'commission-input fixed-price',
      required: '请输入课程折扣',
      type: 'field',
      component: FormNumberInputField,
      helpDesc: '被推荐人下单优惠',
      props: () => ({
        props: {
          ...FIXED_PRICE_PROPS,
          disabled,
        },
      }),
      show: {
        dep: ['commissionRewardType', 'rewardSettings'],
        fn: ([commissionRewardType, rewardSettings]) =>
          commissionRewardType === CommissionType.FIXED_PRICE &&
          (rewardSettings || []).includes(RewardSettingEnum.COMMISSION_REWARD),
      },
      watch: [
        {
          dep: 'courseSelect',
          fn: (_, form) => {
            if (form && form.model.children.courseSelect && form.model.children.discountValue) {
              if (form.model.children.courseSelect.isTouched) {
                form.model.children.discountValue.isTouched = true;
              }
              form.model.children.discountValue.validate();
            }
          },
        },
      ],
      validators: [
        (value, ctx) => {
          if (isNil(value)) {
            return null;
          }
          if (value <= 0) {
            return {
              name: 'invalid discount value',
              message: '被推荐人下单优惠不能为0',
            };
          }
          const { courseSelect } = ctx.getSectionValue() || {};
          if (!courseSelect?.id || courseSelect?.price === 0) { // 没有选择课程或课程价格为0时都不展示错误信息
            return null;
          }
          const goodPrice: number = Number(courseSelect?.price ?? 0);
          if (accMul(Number(value), 100) > goodPrice) { // 被推荐人下单实付金额大于活动商品原价
            return {
              name: 'invalid discount value',
              message: `被推荐人下单优惠不能超过活动课程原价${!isNil(goodPrice) ? `(${accDiv(goodPrice, 100)}元)` : ''}`,
            };
          }
          return null;
        }
      ],
    },
    {
      label: '推荐人邀请佣金：',
      name: 'commissionValue',
      className: 'commission-input fixed-price',
      type: 'field',
      component: FormNumberInputField,
      required: '请输入佣金金额',
      helpDesc: <>
        每推荐 1 位好友报名即可获得佣金
        <p className="fixed-price__tip-alert">若被推荐人下单时实付金额小于佣金金额，可能造成损失，请注意。</p>
      </>,
      props: () => ({
        props: {
          ...FIXED_PRICE_PROPS,
          disabled,
        }
      }),
      show: {
        dep: ['commissionRewardType', 'rewardSettings'],
        fn: ([commissionRewardType, rewardSettings]) =>
          commissionRewardType === CommissionType.FIXED_PRICE &&
          (rewardSettings || []).includes(RewardSettingEnum.COMMISSION_REWARD),
      },
      watch: [
        {
          dep: ['courseSelect', 'discountValue'],
          fn: (_, form) => {
            if (form && form.model.children.courseSelect && form.model.children.discountValue) {
              if (form.model.children.courseSelect.isTouched && form.model.children.discountValue.isTouched) {
                form.model.children.commissionValue.isTouched = true;
              }
              form.model.children.commissionValue.validate();
            }
          },
        },
      ],
      validators: [
        (value, ctx) => {
          if (isNil(value)) {
            return null;
          }
          if (value <= 0) {
            return {
              name: 'invalid discount value',
              message: '佣金金额不能为0',
            };
          }
          const { courseSelect, discountValue } = ctx.getSectionValue() || {};
          if (!courseSelect?.id || courseSelect?.price === 0) { // 没有选择课程或课程价格为0时都不展示错误信息
            return null;
          }
          const goodPrice: number = Number(courseSelect?.price ?? 0);
          const centDiscountValue: number = discountValue ? accMul(Number(discountValue ?? 0), 100) : 0;
          if (accMul(Number(value), 100) > goodPrice) { // 佣金大于活动商品原价
            return {
              name: 'invalid commission',
              message: `佣金金额不能超过活动课程原价${!isNil(goodPrice) ? `(${accDiv(goodPrice, 100)}元)` : ''}`,
            };
          }
          const centRealpayPrice = Math.max(accSub(goodPrice, centDiscountValue), 0);
          if (centRealpayPrice < accMul(Number(value), 100)) { // 佣金大于被推荐人下单实付金额
            return {
              name: 'invalid commission',
              message: `佣金金额不能超过被推荐人下单实付金额${!isNil(centRealpayPrice) ? `(${accDiv(centRealpayPrice, 100)}元)` : ''}`,
            };
          }
          return null;
        }
      ],
    },
    {
      label: '被推荐人下单优惠：',
      name: 'discountRate',
      className: 'commission-input discount',
      required: '请输入课程折扣',
      type: 'field',
      component: FormNumberInputField,
      helpDesc: '被推荐人下单优惠',
      props: () => ({
        props: {
          ...FIXED_RATIO_PROPS,
          disabled,
        },
      }),
      show: {
        dep: ['commissionRewardType', 'rewardSettings'],
        fn: ([commissionRewardType, rewardSettings]) =>
          commissionRewardType === CommissionType.FIXED_RATIO &&
          (rewardSettings || []).includes(RewardSettingEnum.COMMISSION_REWARD),
      },
    },
    {
      label: '推荐人邀请佣金：',
      name: 'commissionRate',
      className: 'commission-input commission',
      required: '请输入佣金比例',
      type: 'field',
      component: FormNumberInputField,
      helpDesc: '每推荐 1 位好友报名即可获得佣金',
      props: () => ({
        props: {
          ...FIXED_RATIO_PROPS,
          disabled,
        },
      }),
      show: {
        dep: ['commissionRewardType', 'rewardSettings'],
        fn: ([commissionRewardType, rewardSettings]) =>
          commissionRewardType === CommissionType.FIXED_RATIO &&
          (rewardSettings || []).includes(RewardSettingEnum.COMMISSION_REWARD),
      },
    },
    {
      name: 'commission-error',
      className: 'referral__reward-settings__error',
      component: CommissionError,
      show: {
        dep: ['rewardSettings', 'courseSelect'],
        fn: (value) => {
          const [rewardSettings, courseSelect] = value || [];

          return checkGoodsPriceEqualsZero({
            rewardSettings: rewardSettings || [],
            courseSelect: courseSelect || {},
          });
        },
      },
    },
    // 分佣奖励 END
  ];
};
