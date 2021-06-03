import React from 'react';

import RewardSetting from './reward-setting';
import RewardDetail from './reward-detail';
import './styles.scss';

interface IRewardManageProps {
  alias: string;
  name: string;
}

const RewardManage: React.FC<IRewardManageProps> = (props) => {
  const { alias } = props;
  return (
    <div className="reward-manage">
      <RewardSetting alias={alias} />
      <RewardDetail alias={alias} />
    </div>
  );
};

export default RewardManage;
