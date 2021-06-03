import { Pop } from '@zent/compat';
import React, { FC, useCallback, useMemo } from 'react';
import { Radio, RadioGroup, NumberInput } from 'zent';
import { BlankLink } from '@youzan/react-components';
import { NewStudentRewardSettingType } from '../../../../types';
import RewardItem from '../reward-item';

import './style.scss';

export interface NewStudentRewardValue {
  newStudentRewardSettingType: number;
  friendHelpTotalNum: number;
  couponList: [];
  presentList: [];
}

interface NewStudentRewardFieldProps {
  disabled?: boolean;
  value: NewStudentRewardValue;
  onChange: (val: Record<string, any>) => void;
  supportWeapp?: boolean;
  isLast?: boolean;
}

const NeedHelpRewardInput: FC<NewStudentRewardFieldProps> = ({
  value,
  onChange,
  disabled = false,
  isLast = false,
}) => {
  const numInputError = useMemo(() => {
    if (value.friendHelpTotalNum === undefined) {
      return '请输入好友人数';
    } else if (value.friendHelpTotalNum > 50) {
      return '最多50人';
    } else if (value.friendHelpTotalNum < 1) {
      return '最少1人';
    }
  }, [value.friendHelpTotalNum]);

  return (
    <div className={`reward-sub-input ${isLast ? 'last-option' : ''}`}>
      <div className="reward-sub-input-line">
        <p style={{ minWidth: 56 }}>好友达到</p>
        <div className={`inline-input-field${numInputError ? ' input-error' : ''}`}>
          <NumberInput
            value={value.friendHelpTotalNum}
            width={105}
            inline
            disabled={disabled}
            min={1}
            max={50}
            onChange={num =>
              onChange({
                friendHelpTotalNum: parseInt(num) || 0
              })
            }
            placeholder="建议10人以内"
          />
          {numInputError && <div className="form-description error-msg">{numInputError}</div>}
        </div>
        <p style={{ minWidth: 28 }}>人</p>
      </div>
      <div className="form-description">
        人数过多会影响新学员参与度，且选择获得好友能量后该活动无法在H5中进行。
      </div>
      <RewardItem
        value={value}
        fromOld={false}
        style={{
          marginLeft: '-10px',
        }}
        disabled={disabled}
        onChange={({ couponList, presentList, checked }) => {
          onChange({
            couponList,
            presentList,
            checked
          });
        }}
      />
    </div>
  );
};

const popContent = (
  <div style={{ width: 285 }}>
    该店铺未授权小程序，获得好友能量活动和分享活动只能在小程序中进行。
    <BlankLink href={`${_global.url.v4}/shop/weapp/unauth?from=basic-info`}>
      前往授权小程序
    </BlankLink>
  </div>
);

const RadioPopWrapper: FC<{ disabled?: boolean; children: React.ReactElement }> = ({
  disabled,
  children,
}) =>
  disabled ? (
    <Pop trigger="hover" position="bottom-center" content={popContent}>
      <div>{children}</div>
    </Pop>
  ) : (
    children
  );

let currentVal;

export const NewStudentRewardField: FC<NewStudentRewardFieldProps> = ({
  value,
  onChange,
  supportWeapp,
  disabled = false,
}) => {
  currentVal = value;
  const handleChange = useCallback(
    (newVal) => {
      onChange({
        ...currentVal,
        ...newVal
      });
    },
    [onChange],
  );
  const handleChangeRewardItem = useCallback(({ couponList, presentList, checked }) => {
    handleChange({
      couponList,
      presentList,
      checked
    });
  }, [handleChange]);
  return (
    <RadioGroup
      className="new-student-reward-field display-error-with-submit"
      value={value.newStudentRewardSettingType}
      onChange={({ target: { value: type = 2 } }) =>
        handleChange({
          ...value,
          couponList: [],
          presentList: [],
          newStudentRewardSettingType: type,
        })
      }
    >
      <div>
        <RadioPopWrapper disabled={!supportWeapp}>
          <Radio disabled={disabled || !supportWeapp} value={NewStudentRewardSettingType.share}>
            新学员分享活动后
          </Radio>
        </RadioPopWrapper>
      </div>
      {value.newStudentRewardSettingType === NewStudentRewardSettingType.share && (
        <RewardItem
          value={value}
          fromOld={false}
          disabled={disabled}
          style={{
            marginLeft: '15px',
          }}
          onChange={handleChangeRewardItem}
        />
      )}
      <div style={{ margin: '4px 0' }}>
        <RadioPopWrapper disabled={!supportWeapp}>
          <Radio
            disabled={disabled || !supportWeapp}
            value={NewStudentRewardSettingType.friendHelp}
          >
            新学员获得好友能量后
          </Radio>
        </RadioPopWrapper>
      </div>
      {value.newStudentRewardSettingType === NewStudentRewardSettingType.friendHelp && (
        <NeedHelpRewardInput
          disabled={disabled}
          value={value}
          onChange={handleChange}
        />
      )}
      <div>
        <Radio disabled={disabled} value={NewStudentRewardSettingType.noRule}>
          无门槛领取奖励
        </Radio>
      </div>
      {value.newStudentRewardSettingType === NewStudentRewardSettingType.noRule && (
        <RewardItem
          value={value}
          fromOld={false}
          disabled={disabled}
          style={{
            marginLeft: '15px',
          }}
          onChange={handleChangeRewardItem}
        />
      )}
    </RadioGroup>
  );
};
