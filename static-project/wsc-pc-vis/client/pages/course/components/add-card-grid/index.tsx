import React from 'react';
import AddCard, { IProps as IAddCardProps } from './add-card';

import style from './style.m.scss';

export interface IProps {
  list: IAddCardProps[];
}

const AddCardGrid: React.FC<IProps> = props => {
  const { list } = props;

  return (
    <div className={style['card-grid']}>
      {list.map((item, index) => (
        <AddCard key={index} {...item} />
      ))}
    </div>
  );
};

export default AddCardGrid;
