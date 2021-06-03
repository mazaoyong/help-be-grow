import React from 'react';

import style from '../style.m.scss';

interface IProps {
  channelId?: string;
  channelPassword?: string;
}

const ChannelInfo: React.FC<IProps> = props => {
  const { channelId, channelPassword } = props;

  return (
    <div className={style['channel-info']}>
      <span>
        <span className={style.label}>频道号：</span>
        <span>{channelId}</span>
      </span>
      <span>
        <span className={style.label}>密码：</span>
        <span>{channelPassword}</span>
      </span>
    </div>
  );
};

export default ChannelInfo;
