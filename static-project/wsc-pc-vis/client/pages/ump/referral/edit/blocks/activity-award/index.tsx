import { Pop } from '@zent/compat';
import React, { FC, ReactElement } from 'react';
import { Checkbox, FormCheckboxGroupField, Icon } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { DistributorAddOnEnum, RewardSettingEnum } from 'pages/ump/referral/types';
import ShopSelector from 'components/field/shop-selector/component';
import { BRANCH_STORE_NAME } from 'constants/chain';
import { isInStoreCondition } from 'fns/chain';

import PhasedRewardField from '../../components/phased-reward-field';
import { getCommissionReward } from '../../fragments/commission-reward';
import { checkGoodsPriceEqualsZero } from '../../utils';
import { DEFAULT_SHOP_INFO_VALUE } from '../../../constants';
import { IActivityAwardProps } from '../../../types';

import 'components/field/shop-selector/index.scss';

const PopWrapper: FC<{
  disabled?: boolean;
  popContent: string | ReactElement;
  children: ReactElement;
}> = ({ disabled, popContent, children }) =>
  disabled ? (
    <Pop trigger="hover" position="top-left" content={popContent}>
      <div>{children}</div>
    </Pop>
  ) : (
    children
  );

const DisibleWrapper: FC<{ disabled?: boolean }> = ({ disabled }) => (
  <div className="group-field-item">
    <Checkbox value={RewardSettingEnum.COMMISSION_REWARD} disabled={disabled}>
      分佣奖励
    </Checkbox>
  </div>
);

const CommissionRewardTip: FC = () => (
  <Pop
    trigger="hover"
    position="top-left"
    content="每邀请1位好友下单即可获得奖励（不支持0元课程设置分佣奖励）。"
  >
    <Icon style={{ marginLeft: '5px', color: '#c8c9cc' }} type="help-circle" />
  </Pop>
);

const CommissionRewardWrapper: FC<any> = ({ disabled }) => {
  return (
    <>
      <DisibleWrapper disabled={disabled} />
      <CommissionRewardTip />
    </>
  );
};

const CommissionRewardDisableWrapper: FC = () => {
  return (
    <>
      <PopWrapper disabled popContent="0元课程不支持设置分佣奖励，可选择其他活动商品。">
        <DisibleWrapper disabled />
      </PopWrapper>
      <CommissionRewardTip />
    </>
  );
};

const ActivityAward = (props: IActivityAwardProps): IFormCreatorConfig => {
  const { id, disabled, disableGoods } = props;
  const isInStore = isInStoreCondition({
    supportHqStore: true,
  });

  return {
    keyName: 'activity-award',
    component: ({ children }) => (
      <div className="form-block">
        <h2 className="new-title with-text">活动奖励</h2>
        {children}
      </div>
    ),
    children: [
      {
        component: (
          <div className="referral__desc-info referral__desc-info__activity-award">
            推荐人将课程分享给被推荐人，被推荐人享受下单优惠后，推荐人可获得相应奖励。
          </div>
        ),
      },
      // ===================== 奖励设置 ======================
      {
        label: '奖励设置：',
        name: 'rewardSettings',
        className: 'referral__reward-settings form-error-control',
        required: '请至少选择一项奖励设置',
        type: 'field',
        component: FormCheckboxGroupField,
        children: [
          // 非0元商品 || 0元商品且已选分佣
          {
            name: 'rewardSettings-1',
            className: 'referral__reward-settings__commission',
            component: CommissionRewardWrapper,
            props: () => ({
              disabled,
            }),
            show: {
              dep: ['rewardSettings', 'courseSelect'],
              fn: (value) => {
                const [rewardSettings, courseSelect] = value || [];
                const isGoodsPriceEqualsZero = (courseSelect || {}).price === 0;
                return (
                  !isGoodsPriceEqualsZero ||
                  checkGoodsPriceEqualsZero({
                    rewardSettings: rewardSettings || [],
                    courseSelect: courseSelect || {},
                  })
                );
              },
            },
          },
          // 【0元禁用态】0元商品 && 未选分佣
          {
            name: 'rewardSettings-2',
            className: 'referral__reward-settings__commission',
            component: CommissionRewardDisableWrapper,
            show: {
              dep: ['rewardSettings', 'courseSelect'],
              fn: (value) => {
                const [rewardSettings, courseSelect] = value || [];
                const isGoodsPriceEqualsZero = (courseSelect || {}).price === 0;
                return (
                  isGoodsPriceEqualsZero &&
                  !(rewardSettings || []).includes(RewardSettingEnum.COMMISSION_REWARD)
                );
              },
            },
          },
          ...getCommissionReward(props),
          {
            keyName: 'rewardSettings-3',
            component: ({ children }) => (
              <>
                <div className="group-field-item">
                  <Checkbox value={RewardSettingEnum.PHASED_REWARD} disabled={disabled}>
                    阶梯任务奖励
                    <Pop
                      trigger="hover"
                      position="top-left"
                      content="报名后，邀请X位好友报名课程，可获得以下奖励。"
                    >
                      <Icon style={{ marginLeft: '5px', color: '#c8c9cc' }} type="help-circle" />
                    </Pop>
                  </Checkbox>
                </div>
                {children}
              </>
            ),
          },
          // 阶梯奖励
          {
            name: 'phasedRewardDetails',
            className: 'referral__phased-reward-detail',
            component: PhasedRewardField,
            defaultValue: [],
            props: () => ({
              disabled,
            }),
            show: {
              dep: 'rewardSettings',
              fn: (rewardSettings) =>
                (rewardSettings || []).includes(RewardSettingEnum.PHASED_REWARD),
            },
          },
        ],
      },
      // ===================== 优惠叠加 ======================
      {
        label: '优惠叠加：',
        name: 'distributorAddOn',
        type: 'field',
        className: 'referral__distributor-add-on',
        component: FormCheckboxGroupField,
        children: [
          {
            keyName: 'distributorAddOn-1',
            component: (
              <div className="group-field-item">
                <Checkbox value={DistributorAddOnEnum.ON} disabled={disabled}>
                  叠加销售员活动
                </Checkbox>
              </div>
            ),
          },
          {
            name: 'distributor-1',
            className: 'referral__desc-info__wrapper',
            component: () => (
              <div key="1" className="referral__desc-info">
                不勾选时，若活动课程同时配置了销售员活动，被推荐人购买活动课程时若有绑定的销售员关系，则推荐人可获得推荐有奖奖励，销售员可获得销售员奖励。若不想给出2个奖励，建议在分销员中将活动商品设置为不参与推广。
              </div>
            ),
            show: {
              dep: 'distributorAddOn',
              fn: (val) => {
                return !val || !val.length;
              },
            },
          },
          {
            name: 'distributor-2',
            className: 'referral__desc-info__wrapper',
            component: () => (
              <div key="2" className="referral__desc-info">
                被推荐人购买活动课程时若有绑定的销售员关系，推荐人获得推荐奖励，销售员可以获得销售员佣金；若被推荐人没有绑定的销售员关系，则推荐人会与被推荐人绑定关系，同时获得销售员佣金和推荐奖励。
              </div>
            ),
            show: {
              dep: 'distributorAddOn',
              fn: (val) => {
                return val && val.length;
              },
            },
          },
        ],
      },
      // ===================== 适用校区 ======================
      {
        label: `适用${BRANCH_STORE_NAME}：`,
        name: 'shopInfo',
        required: true,
        className: 'referral__choose-school form-error-control',
        component: ShopSelector,
        defaultValue: DEFAULT_SHOP_INFO_VALUE,
        props: () => ({
          id,
          isEdit: disableGoods,
          isCheckRemove: false,
          isCanDelete: disableGoods,
        }),
        show: {
          value: isInStore,
        },
        validators: [
          (val) => {
            if (!val || (!val.applicableCampusType && !val.applicableCampusList.length)) {
              return {
                name: 'shopInfo',
                message: `请选择${BRANCH_STORE_NAME}`,
              };
            }
          },
        ],
      },
    ],
  };
};

export default ActivityAward;
