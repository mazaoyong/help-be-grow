import React, { FC } from 'react';
import { IStatistics } from '../interface';
import { STATISTICS } from '../../constants';
import keys from 'lodash/keys';
import './index.scss';

const RecordStatistics: FC<Partial<IStatistics>> = (props) => {
  return <div className='record-statistics-wrap'>
    {keys(STATISTICS).map(key => {
      let data = props[key] || '0';
      if (key === 'consumeAssetNum') {
        data = typeof data === 'number' ? data / 100 : 0;
      }
      return <div key={key} className='record-number-wrap'>
        <p className='record-statistics-data'>{data}</p>
        <span>{STATISTICS[key]}</span>
      </div>;
    })}
  </div>;
};

export default RecordStatistics;
