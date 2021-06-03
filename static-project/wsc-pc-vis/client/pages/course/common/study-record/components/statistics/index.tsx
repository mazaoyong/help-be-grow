import React, { FC } from 'react';
import { IStatistics } from '../../types';
import { STUDY_INDEX } from '../../constants';
import './style.scss';

const StatisticsFC: FC<IStatistics> = (props) => {
  return <div className='statistics-container'>
    {Object.keys(STUDY_INDEX).map(item => <div key={item} className='statistics-item'>
      <p className='statistics-title'>{STUDY_INDEX[item]}</p>
      <p className='statistics-value'>{`${props[item]}${item === 'finishLessonRate' ? '%' : ''}`}</p>
    </div>
    )}
  </div>;
};

export default StatisticsFC;
