import React, { FC } from 'react';
import { ITreeHeaderProps } from './types';
import './style.scss';

const TreeHeader: FC<ITreeHeaderProps> = (props) => {
  const { hasOperations } = props;

  return (
    <div className ="tree-header__wrapper">
      <span>目录名称</span>
      <span>内容数量</span>
      {hasOperations && <span>操作</span>}
    </div>
  );
};

export default TreeHeader;
