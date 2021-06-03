import React, { FC } from 'react';
import { Radio } from 'zent';
import { posterStyleType, ActivityVersion } from '../../../../types';

import './styles.scss';

const RadioGroup = Radio.Group;

const posterImageList = {
  [ActivityVersion.two]: [
    '//b.yzcdn.cn/public_files/c5e1760a9e0d18c39e8e53dcd5541fc3.png',
    '//b.yzcdn.cn/public_files/ad5ee8d3885c7353e7b9db54af1bb320.png',
    '//b.yzcdn.cn/public_files/910ae3547738f854ecfe1bd8c75e5d4c.png',
  ],
  [ActivityVersion.one]: [
    '//b.yzcdn.cn/public_files/1a378b3c4129fa17ddac50d68f76bd12.png',
    '//b.yzcdn.cn/public_files/21020927cf4f6d038a81253e9b1fb538.png',
    '//b.yzcdn.cn/public_files/99e1b16e953addf917fcd745d986012e.png',
  ],
  [ActivityVersion.zero]: [
    '//b.yzcdn.cn/public_files/1a378b3c4129fa17ddac50d68f76bd12.png',
    '//b.yzcdn.cn/public_files/21020927cf4f6d038a81253e9b1fb538.png',
    '//b.yzcdn.cn/public_files/99e1b16e953addf917fcd745d986012e.png',
  ]
};

const PosterSelectField: FC<{
  value: posterStyleType;
  disabled: boolean;
  activityVersion: number;
  onChange: (value: posterStyleType) => void;
}> = (props) => {
  const { value, onChange, disabled, activityVersion = ActivityVersion.two } = props;

  return (
    <RadioGroup
      value={value}
      disabled={disabled}
      onChange={(e) => {
        const val = e.target.value || 1;
        onChange(val);
      }}
    >
      {posterImageList[activityVersion].map((imgsrc, index) => (
        <Radio className="poster-select" value={index + 1} key={index}>
          <img width="84px" src={imgsrc} alt={`活动页风格${index + 1}`} />
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default PosterSelectField;
