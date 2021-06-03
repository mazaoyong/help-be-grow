import React, { FC } from 'react';
import RewardsList from '../components/RewardsList.jsx';
import '../style/list-page.scss';

const RewardsListPage:FC<{rewardNodeType: string}> = (props) => {
  return (
    <div className="rewards-list">
      {/* {!isEduBranchStore && (
        <SamButton
          name="编辑"
          type="primary"
          className="reward-create-btn"
          onClick={() => hashHistory.push('/add')}
        >
          新建奖励
        </SamButton>
      )} */}
      <RewardsList {...props}/>
    </div>
  );
};

export default RewardsListPage;
