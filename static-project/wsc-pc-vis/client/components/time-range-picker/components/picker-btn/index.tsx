import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import classnames from 'classnames';
import { isNumber } from 'lodash';

import './style.scss';

export interface IPresetItem {
  text: string;
  onClick: (chooseIndex: number) => void;
}

export interface IPickerBtnRef {
  resetSelectedIndex: () => void;
}

interface IPickerBtnProps {
  preset: IPresetItem[];
  chooseIndex?: number;
}

const PickerBtn = forwardRef<IPickerBtnRef, IPickerBtnProps>(({ preset, chooseIndex }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  useEffect(() => {
    if (isNumber(chooseIndex)) {
      setSelectedIndex(chooseIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    resetSelectedIndex: () => {
      setSelectedIndex(undefined);
    },
  }));

  return (
    <div className="time-range-picker__btn">
      {preset.map((item, index) => (
        <span
          key={index}
          className={classnames('picker-btn', {
            active: selectedIndex === index,
          })}
          onClick={() => {
            item.onClick(index);
            setSelectedIndex(index);
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
});

export default PickerBtn;
