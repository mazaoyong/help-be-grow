import React, { FC } from 'react';
import { LayoutCol } from 'zent';

import style from './export-item-label.m.scss';

export interface IExportItemLabelProps {
  title: string;
  labelWidth: 1 | 2 | 3 | 4;
}

export const ExportItemLabel: FC<IExportItemLabelProps> = props => {
  return (
    <LayoutCol className={style.exportLabel} span={props.labelWidth * 6}>
      {props.title}：{props.children}
    </LayoutCol>
  );
};
