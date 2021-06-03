import React, { FC } from 'react';

import './style.scss';

interface EmptyListTipsProps {
  children?: React.ReactNode;
}

export const EmptyListTips: FC<EmptyListTipsProps> = ({ children }) => {
  return (
    <div className="empty-list-tips">
      <img src="https://b.yzcdn.cn/public_files/dc4687ea4f632381bf2c7b84ebefa14e.png" />
      {children}
    </div>
  );
};
