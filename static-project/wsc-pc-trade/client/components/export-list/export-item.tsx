import React, { FC } from 'react';
import { BlockLoading } from 'zent';

import style from './export-item.m.scss';

export interface IExportItemProps {
  isLoading?: boolean;
}

export const ExportItem: FC<IExportItemProps> = props => {
  return (
    <div className={style.itemWrapper}>
      <BlockLoading loading={props.isLoading || false}>{props.children}</BlockLoading>
    </div>
  );
};
