import React from 'react';
import { ClampLines } from 'zent';

import './styles.scss';

interface IInfoDetailSeperator {
  type: 'seperator';
  hidden?: boolean;
}

interface IInfoDetailData {
  type: 'data';
  key: string;
  value: string | number;
  hidden?: boolean;
  needClamp?: boolean;
}

interface IInfoDetailListProps {
  data: (IInfoDetailData | IInfoDetailSeperator)[];
}

function parseSeperator(data: IInfoDetailSeperator) {
  return (
    data.hidden
      ? null
      : <li>
        <div className="info-detail__seperator" />
      </li>
  );
}

function parseDetailData(data: IInfoDetailData) {
  const { key, value, hidden, needClamp } = data;
  if (value === null || value === undefined || value === '') return null; // 如果值为空，不展示
  if (hidden) return null; // 如果隐藏条件为true，不展示
  return (
    <li>
      <span>{key}</span>
      {needClamp
        ? <ClampLines lines={1} text={String(value)} />
        : <span>{value}</span>
      }
    </li>
  );
}

function InfoDetailList({ data: dataList = [] }: IInfoDetailListProps) {
  return (
    <div className="info-detail__list">
      <ul>
        {dataList.map(data => {
          if (data.type === 'seperator') {
            return parseSeperator(data);
          } else {
            return parseDetailData(data);
          };
        })}
      </ul>
    </div>
  );
};

export default InfoDetailList;
