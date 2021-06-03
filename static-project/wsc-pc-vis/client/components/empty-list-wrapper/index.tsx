import React, { FC } from 'react';

import './styles.scss';

interface IEmptyListWrapperProps {
  children?: React.ReactNode;
}

const EmptyListWrapper: FC<IEmptyListWrapperProps> = ({ children }) => {
  return (
    <div className="empty-list-tips">
      <img src="//b.yzcdn.cn/public_files/dc4687ea4f632381bf2c7b84ebefa14e.png" alt="" />
      {children}
    </div>
  );
};

export default EmptyListWrapper;
