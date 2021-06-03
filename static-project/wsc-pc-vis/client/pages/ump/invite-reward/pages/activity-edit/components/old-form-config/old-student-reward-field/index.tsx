import React from 'react';
import { Checkbox, Input } from 'zent';
import './styles.scss';

const REWARD_TYPE_LIST = ['老学员分享活动后', '新学员领取奖励后', '新学员到店体验课程后', '新学员购买正式课后'];
const REWARD_NODE_LIST = ['share', 'receive', 'expreience', 'buy'];

const RewardDetail = ({ value: { name = '' } }) => {
  return (
    <div className="old-student-reward__detail">
      送<Input
        inline
        className='input-box'
        width="207px"
        placeholder="20字以内"
        defaultValue={name}
      />
    </div>
  );
};

const OldStudentRewardField = ({ value = {} }) => {
  return (
    <div>
      {REWARD_TYPE_LIST
        .map((rewardNodeName, index) => (
          <div key={rewardNodeName} className="old-student-reward__checkbox">
            <Checkbox checked={value[REWARD_NODE_LIST[index]]}>
              {rewardNodeName}
            </Checkbox>
            {value[REWARD_NODE_LIST[index]]
              ? <RewardDetail
                value={value[REWARD_NODE_LIST[index]]}
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
