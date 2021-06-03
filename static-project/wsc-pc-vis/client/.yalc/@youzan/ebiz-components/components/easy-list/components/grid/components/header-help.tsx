import React, { FC } from 'react';
import { Pop, Icon} from 'zent';
import cx from 'classnames';

import { IHeaderHelpProps } from '../../../types/grid';


const HeaderHelp: FC<IHeaderHelpProps> = props => {
  const { title, headerHelp, className, position = 'top-center', iconType = 'help-circle' } = props;
  return (
    <div className={cx('header-help', className)}>
      <span className="header-help-title">{title}</span>
      <Pop trigger='hover' position={position} content={headerHelp}>
        <Icon className="header-help-icon" type={iconType} />
      </Pop>
    </div>
  );
};

export default HeaderHelp;
