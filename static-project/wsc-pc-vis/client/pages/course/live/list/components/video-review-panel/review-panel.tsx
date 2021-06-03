import { Pop } from '@zent/compat';
import React, { ReactNode } from 'react';
import { Icon } from 'zent';

import style from './style.m.scss';

export interface IDataItem {
  title: string;
  tips?: ReactNode | string;
  value: ReactNode | String | number;
  valueTips?: ReactNode | string;
}

interface IProps {
  data: IDataItem[];
}

const ReviewPanel: React.FC<IProps> = (props) => {
  const { data } = props;

  return (
    <div className={style['review-panel']}>
      {data.map(({ title, tips, value, valueTips }) => (
        <div className="reivew-panel__item" key={title}>
          <div className="reivew-panel__item-content">
            <div className="reivew-panel__item-title">
              <span>{title}</span>
              {tips && (
                <Pop className="card-tips" content={tips} trigger="hover" position="bottom-left">
                  <Icon type="help-circle" />
                </Pop>
              )}
            </div>
            {valueTips ? (
              <Pop content={valueTips} trigger="hover" position="bottom-left">
                <div className="reivew-panel__item-value">{value}</div>
              </Pop>
            ) : (
              <div className="reivew-panel__item-value">{value}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewPanel;
