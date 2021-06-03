import { Select } from '@zent/compat';
import React, { FC, useRef } from 'react';
import Maskguide from 'components/mask-guide';

export interface PopSelectProps {
  data: any[];
  value: string;
  onChange: () => {}
  [index: string]: any;
}

const PopSelect:FC<PopSelectProps> = (props) => {
  const { data, value, onChange = () => {}, ...restProps } = props;
  const maskRef = useRef<HTMLDivElement | null>(null);
  return <div ref={maskRef}>
    <Select
      data={data}
      value={value}
      onChange={onChange}
      {...restProps}
    />
    <Maskguide
      fieldRef={maskRef}
      storageKey={`order-partner-list-${_global.kdtId}`}
      styles={{ top: '0', left: '90px', width: '230px' }}
      popClassName='order-selector__pop'
    />
  </div>;
};

export default PopSelect;
