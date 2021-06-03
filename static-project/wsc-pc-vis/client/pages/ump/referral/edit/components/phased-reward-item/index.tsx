import React, { FC, useCallback, useContext, useState, useMemo } from 'react';
import { BlockHeader, NumberInput, FormError } from 'zent';
import { LinkButton } from '@youzan/react-components';
import { IPhasedRewardItem } from 'pages/ump/referral/types';
import RewardField, { IRewardFieldValue, FieldType } from 'components/field/reward-field';

import { NUMBER_CHINESE_MAP } from 'pages/ump/referral/constants';
import { Context } from '../../context';

import './styles.scss';

type Payload = Partial<IPhasedRewardItem>;

export interface IChangeParams {
  index: number;
  payload: Payload;
}

export interface IPhasedRewardItemProps extends Payload {
  index?: number;
  uuid: number;
  rewardList: IOmitPhasedRewardItemProps[];
  disabled: boolean;
  onChange: (params: IChangeParams) => void;
  onDelete: (index: number) => void;
}

export type IOmitPhasedRewardItemProps = Omit<
IPhasedRewardItemProps,
'onChange' | 'onDelete' | 'rewardList' | 'disabled'
>;

const PhasedRewardItem: FC<IPhasedRewardItemProps> = ({
  index = 0,
  helpCount,
  rewardName = '',
  bonusPoint,
  couponList = [],
  presentList = [],
  rewardList,
  disabled,
  onChange,
  onDelete,
}) => {
  const { state } = useContext(Context);
  const isFormSubmitted = state.formSubmitted || false;
  const rewardLength = rewardList.length;

  const [_helpCount, setHelpCount] = useState(helpCount);
  const [rewardValue, setRewardValue] = useState<IRewardFieldValue>({
    name: rewardName,
    point: bonusPoint,
    coupon: couponList.length ? couponList : [],
    present: presentList.length ? presentList : [],
  });
  const fieldConfig = useMemo(() => {
    return [FieldType.NAME, FieldType.POINT, FieldType.COUPON, FieldType.PRESENT];
  }, []);

  // 更新「奖励门槛」
  const handleHelpCountChange = e => {
    setHelpCount(e);
    onChange({
      index,
      payload: {
        helpCount: e,
      },
    });
  };

  const handleDelete = useCallback(() => {
    if (!disabled && rewardLength > 1) {
      onDelete(index);
    }
  }, [disabled, index, onDelete, rewardLength]);

  const handleChangeRewardValue = useCallback(
    ({ name, point, coupon, present, checked }) => {
      setRewardValue({
        name,
        point,
        coupon,
        present,
        checked
      });
      onChange({
        index,
        payload: {
          rewardName: name,
          bonusPoint: point,
          couponList: coupon,
          presentList: present,
          checked
        },
      });
    },
    [index, onChange],
  );

  return (
    <div className={`referral__phased-reward-field__item ${isFormSubmitted ? 'has-submit' : ''}`}>
      <BlockHeader
        title={`${NUMBER_CHINESE_MAP[index]}级任务`}
        rightContent={
          disabled ? null : (
            <LinkButton onClick={handleDelete} disabled={rewardLength === 1}>
              删除
            </LinkButton>
          )
        }
      />

      {/* 奖励门槛 */}
      <div className="reward-field-block form-error-control">
        <label className="reward-field-label reward-field-label-required">奖励门槛：</label>
        <div className="reward-field-content">
          <div className="reward-field-content-inner">
            <span>推荐</span>
            <NumberInput
              showStepper
              min={1}
              max={999}
              width={137}
              placeholder="1-999"
              value={_helpCount}
              disabled={disabled}
              onChange={handleHelpCountChange}
              style={{ margin: '0 7px' }}
            />
            <span>位好友报名课程</span>
          </div>
          {isFormSubmitted &&
            (!_helpCount ? (
              <FormError>请输入推荐人数</FormError>
            ) : (
              index > 0 &&
              Number(rewardList[index].helpCount || 0) <=
                Number(rewardList[index - 1].helpCount || 0) && (
                <FormError>需大于上一级任务推荐人数</FormError>
              )
            ))}
        </div>
      </div>
      <RewardField
        value={rewardValue}
        disabled={disabled}
        fieldConfig={fieldConfig}
        onChange={handleChangeRewardValue}
      />
    </div>
  );
};

export default PhasedRewardItem;
