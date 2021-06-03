import React, { FC, useCallback } from 'react';
import { Checkbox } from 'zent';

import RewardItem, { AwardValue } from '../reward-item';
import './styles.scss';

export enum NodeType {
  SHARE = 'share',
  RECEIVE = 'receive',
  EXPREIENCE = 'expreience',
  BUY = 'buy'
}

export enum NodeTypeNumber {
  share = 1,
  receive,
  expreience,
  buy
}

export enum NodeLabel {
  share = '分享',
  receive = '邀请好友',
  expreience = '邀请好友',
  buy = '邀请好友'
}

export type AwardsValue = Record<NodeType, AwardValue>;

const REWARD_TYPE_LIST = [
  {
    nodeType: NodeType.SHARE,
    nodeLabel: '老学员分享活动后'
  },
  {
    nodeType: NodeType.RECEIVE,
    nodeLabel: '新学员领取奖励后'
  },
  {
    nodeType: NodeType.EXPREIENCE,
    nodeLabel: '新学员到店体验课程后'
  },
  {
    nodeType: NodeType.BUY,
    nodeLabel: '新学员购买正式课后'
  },
];
interface IProps {
  value: AwardsValue;
  onChange: (val: AwardsValue) => void;
  disabled: boolean;
}

let currentVal;

const OldStudentRewardField: FC<IProps> = ({ value, onChange, disabled }) => {
  currentVal = value;
  const onCheckboxToggled = useCallback(nodeType => e => {
    if (e.target.checked === true) {
      value[nodeType] = {
        pointCount: undefined,
        name: '',
        couponList: [],
        presentList: []
      };
    } else {
      delete value[nodeType];
    };
    onChange({ ...value });
  }, [onChange, value]);

  const rewardItemChange = useCallback((nodeType, val) => {
    onChange({
      ...currentVal,
      [nodeType]: val
    });
  }, [onChange]);
  return (
    <div className='display-error-with-submit'>
      {REWARD_TYPE_LIST
        .map((item) => (
          <div key={item.nodeType} className="old-student-reward__checkbox">
            <Checkbox disabled={disabled} checked={!!value[item.nodeType]} onChange={onCheckboxToggled(item.nodeType)}>
              {item.nodeLabel}
            </Checkbox>
            {value[item.nodeType]
              ? <RewardItem
                value={value[item.nodeType]}
                disabled={disabled}
                nodeType={item.nodeType}
                onChange={(val) => {
                  rewardItemChange(item.nodeType, val);
                }}
              />
              : null
            }
          </div>
        ))
      }
    </div>
  );
};

export default OldStudentRewardField;
