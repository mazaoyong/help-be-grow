import React, { FC } from 'react';
import { IDetailStatistics } from '../../types';
import { STUDY_DETAIL_INDEX } from '../../constants';
import './style.scss';

const StatisticsFC: FC<IDetailStatistics> = (props) => {
  return <div className='statistics-container'>
    {Object.keys(STUDY_DETAIL_INDEX).map(item => <div key={item} className='statistics-item'>
      <p className='statistics-title'>{STUDY_DETAIL_INDEX[item]}</p>
      <p className='statistics-value'>{`${props[item]}${item === 'learnProgress' ? '%' : ''}`}</p>
    </div>
    )}
  </div>;
};

export default StatisticsFC;
