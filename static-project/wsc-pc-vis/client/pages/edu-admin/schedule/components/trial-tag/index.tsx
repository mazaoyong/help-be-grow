import React, { FC } from 'react';
import { Tag } from 'zent';
import './index.scss';

const TrialTag: FC<{}> = () => {
  return <Tag className='schedule_trial_tag'>
    试听
  </Tag>;
};

export default TrialTag;
