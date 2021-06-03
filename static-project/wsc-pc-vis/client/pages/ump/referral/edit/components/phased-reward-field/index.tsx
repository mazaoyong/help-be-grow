import React, { FC, useEffect, useRef } from 'react';
import update from 'immutability-helper';
import { LinkButton } from '@youzan/react-components';
import PhasedRewardItem, { IChangeParams, IOmitPhasedRewardItemProps } from '../phased-reward-item';
import { getUuid } from '../../../utils';

import './styles.scss';

interface IPhasedRewardFieldProps {
  disabled: boolean;
  value: IOmitPhasedRewardItemProps[];
  onChange: (data: IOmitPhasedRewardItemProps[]) => void;
}

const initItem: IOmitPhasedRewardItemProps = {
  helpCount: undefined,
  rewardName: undefined,
  bonusPoint: undefined,
  couponList: [],
  presentList: [],
  uuid: getUuid(),
};

const PhasedRewardField: FC<IPhasedRewardFieldProps> = ({ disabled, value = [], onChange }) => {
  const refValue = useRef<IOmitPhasedRewardItemProps[]>([]);
  refValue.current = value;

  const listLength = value.length;

  useEffect(() => {
    if (!listLength) {
      onChange([initItem]);
    }
  }, [listLength, onChange]);

  const handleAdd = () => {
    const newPhasedRewardList = value.concat({
      ...initItem,
      uuid: getUuid(),
    });

    onChange(newPhasedRewardList);
  };

  const handleChange = (params: IChangeParams) => {
    const { index, payload } = params;

    const newPhasedRewardList = update(refValue.current, {
      $splice: [
        [
          index,
          1,
          {
            ...refValue.current[index],
            ...payload,
          },
        ],
      ],
    });

    onChange(newPhasedRewardList);
  };

  const handleDelete = (index: number) => {
    const newPhasedRewardList = update(value, {
      $splice: [[index, 1]],
    });
    onChange(newPhasedRewardList);
  };

  return (
    <>
      <div className="referral__phased-reward-field">
        {value.map((item, index) => (
          <PhasedRewardItem
            key={item.uuid || item.phaseNo}
            index={index}
            rewardList={value}
            disabled={disabled}
            onChange={handleChange}
            onDelete={handleDelete}
            {...item}
          />
        ))}
      </div>
      {!disabled && listLength < 4 && (
        <div className="referral__phased-reward-field__add">
          <LinkButton onClick={handleAdd}>
            增加新一级任务
          </LinkButton>
        </div>
      )}
    </>
  );
};

export default PhasedRewardField;
