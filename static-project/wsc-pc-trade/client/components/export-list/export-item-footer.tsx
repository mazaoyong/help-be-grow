import React, { FC } from 'react';
import { Icon } from 'zent';

import style from './export-item-footer.m.scss';

export interface IExportItemFooterProps {
  isExporting?: boolean;
  isFailed?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => unknown;
}

export const ExportItemFooter: FC<IExportItemFooterProps> = props => {
  const footerContent = () => {
    if (props.isExporting) {
      return <span className={style.footerContent}>报表生成中...</span>;
    } else if (props.isFailed) {
      return (
        <span>
          <Icon type="close-circle" />
          报表生成失败
        </span>
      );
    }
    return props.children;
  };
  const refreshButton = () => {
    if ((props.isExporting || props.isFailed) && props.showRefresh) {
      return (
        <span onClick={props.onRefresh} className={style.refreshButton}>
          刷新
        </span>
      );
    }
  };
  return (
    <footer className={style.footerWrap}>
      {footerContent()}
      {refreshButton()}
    </footer>
  );
};
