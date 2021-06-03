import React, { FC } from 'react';
import { LayoutGrid, LayoutRow } from 'zent';

import style from './export-item-body.m.scss';

export interface IExportItemBodyProps {
  createTime: string;
  operator: string;
}

function Divider() {
  return <div className={style.divider} />;
}

export const ExportItemBody: FC<IExportItemBodyProps> = props => {
  return (
    <>
      <header className={style.headerWrapper}>
        <h2 className={style.headerTitle}>申请时间：{props.createTime}</h2>
        <h2 className={style.headerTitle}>申请人：{props.operator}</h2>
      </header>
      <Divider />
      <LayoutGrid>
        <LayoutRow className={style.bodyWrapper}>{props.children}</LayoutRow>
      </LayoutGrid>
    </>
  );
};
