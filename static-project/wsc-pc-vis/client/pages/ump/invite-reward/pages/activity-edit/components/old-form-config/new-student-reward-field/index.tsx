import { Pop } from '@zent/compat';
import React, { FC } from 'react';
import { Radio, RadioGroup, Input } from 'zent';
import { BlankLink } from '@youzan/react-components';

import './style.scss';

const NormalRewardInput = ({ value, isLast = false }) => {
  const error = !value.newStudentRewardRuleDesc;
  return (
    <div className={`reward-sub-input ${isLast ? 'last-option' : ''}`}>
      送
      <div className={`inline-input-field${error ? ' input-error' : ''}`}>
        <Input value={value.newStudentRewardRuleDesc} width={207} inline placeholder="20个字以内" />
      </div>
      {error && <div className="form-description error-msg">请输入新学员奖励</div>}
      <div className="form-description">建议赠送体验课、优惠券，引导新学员到店体验、进行消费。</div>
    </div>
  );
};

const NeedHelpRewardInput = ({ value, isLast = false }) => {
  return (
    <div className={`reward-sub-input ${isLast ? 'last-option' : ''}`}>
      <div className="reward-sub-input-line">
        <p style={{ minWidth: 56 }}>好友达到</p>
        <div className={`inline-input-field`}>
          <Input
            value={value.friendHelpTotalNum === undefined ? '' : `${value.friendHelpTotalNum}`}
            width={105}
            inline
            placeholder="建议10人以内"
          />
        </div>
        <p style={{ minWidth: 28 }}>人送</p>
        <div className={`inline-input-field`}>
          <Input
            value={value.newStudentRewardRuleDesc || ''}
            width={207}
            inline
            placeholder="20个字以内"
          />
        </div>
      </div>
      <div className="form-description">
        人数过多会影响新学员参与度，且选择获得好友能量后该活动无法在H5中进行。
      </div>
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

export const NewStudentRewardField = ({ value, supportWeapp, disabled }) => {
  return (
    <RadioGroup className="new-student-reward-field" value={value.newStudentRewardSettingType}>
      <div>
        <RadioPopWrapper disabled={!supportWeapp}>
          <Radio disabled={disabled || !supportWeapp} value={2}>
            新学员分享活动后
          </Radio>
        </RadioPopWrapper>
      </div>
      {value.newStudentRewardSettingType === 2 && <NormalRewardInput value={value} />}
      <div style={{ margin: '4px 0' }}>
        <RadioPopWrapper disabled={!supportWeapp}>
          <Radio disabled={disabled || !supportWeapp} value={3}>
            新学员获得好友能量后
          </Radio>
        </RadioPopWrapper>
      </div>
      {value.newStudentRewardSettingType === 3 && <NeedHelpRewardInput value={value} />}
      <div>
        <Radio value={1}>无门槛领取奖励</Radio>
      </div>
      {value.newStudentRewardSettingType === 1 && <NormalRewardInput value={value} isLast />}
    </RadioGroup>
  );
};
