import React, { FC, useCallback, useState, useMemo, CSSProperties } from 'react';
import RewardField, {
  IRewardFieldValue,
  FieldType,
  IRewardItemVal,
} from 'components/field/reward-field';
import { RewardTypeEnum } from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';

import './index.scss';

export type AwardValue = {
  pointCount?: number;
  name?: string;
  couponList: IRewardItemVal[];
  presentList: IRewardItemVal[];
  checked?: RewardTypeEnum[];
};

interface IProps {
  disabled: boolean;
  value: AwardValue;
  fromOld?: boolean;
  style?: CSSProperties;
  nodeType?: string;
  onChange: (val: AwardValue) => void;
}

const RewardItem: FC<IProps> = ({ disabled, value, onChange, fromOld = true, style, nodeType }) => {
  const { name, pointCount, couponList, presentList } = value;
  const [rewardValue, setRewardValue] = useState<IRewardFieldValue>({
    name: fromOld ? name : '',
    point: fromOld ? pointCount : undefined,
    coupon: couponList.length ? couponList : [],
    present: presentList.length ? presentList : [],
  });
  const fieldConfig = useMemo(() => {
    if (fromOld) {
      return nodeType === 'share'
        ? [FieldType.NAME, FieldType.POINT]
        : [FieldType.NAME, FieldType.POINT, FieldType.COUPON, FieldType.PRESENT];
    }
    return [FieldType.COUPON, FieldType.PRESENT];
  }, [fromOld, nodeType]);

  const handleChangeRewardValue = useCallback(
    ({ name, point, present, coupon, checked }) => {
      setRewardValue({
        name,
        point,
        present,
        coupon,
        checked,
      });
      const newVal: AwardValue = {
        couponList: coupon,
        presentList: present,
        checked,
      };
      if (fromOld) {
        newVal.pointCount = point;
        newVal.name = name;
      }
      onChange(newVal);
    },
    [fromOld, onChange],
  );

  return (
    <div className="reward-item" style={style}>
      {fromOld && <div className="reward-item-title">奖励设置</div>}
      <RewardField
        value={rewardValue}
        disabled={disabled}
        fieldConfig={fieldConfig}
        showLabel={fromOld}
        onChange={handleChangeRewardValue}
      />
    </div>
  );
};

export default RewardItem;
