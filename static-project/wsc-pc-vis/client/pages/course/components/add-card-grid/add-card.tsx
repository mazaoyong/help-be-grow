import { Pop } from '@zent/compat';
import React, { ReactNode } from 'react';
import { Icon } from 'zent';

import style from './style.m.scss';

export interface IProps {
  title: string;
  tips?: ReactNode | string;
  content?: Array<string | ReactNode>;
  action?: () => void;
  footer?: string | ReactNode;
}

const AddCard: React.FC<IProps> = props => {
  const { title, tips, content = [], footer } = props;

  return (
    <div className={style.card}>
      <div>
        <div className="card-title">
          <span>{title}</span>
          {tips && (
            <Pop className="card-tips" position="right-top" trigger="hover" content={tips}>
              <Icon type="help-circle" />
            </Pop>
          )}
        </div>
        <div className="card-content">
          {content.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      </div>
      <div className="card-footer">{footer}</div>
    </div>
  );
};

export default AddCard;
