import React from 'react';
import { IModel } from './type';

interface IProps {
  multiPeriodDeliveryInfo: IModel['multi_period_delivery_info'];
  distType: IModel['dist_type'];
}

const Title = ({ multiPeriodDeliveryInfo, distType }: IProps) => {
  if (distType === 1) {
    return <div>自提发货</div>;
  }
  if (!multiPeriodDeliveryInfo) {
    return <div>订单发货</div>;
  }
  return (
    <div>
      订单发货
      <span>
        （第 <span className="orange">{multiPeriodDeliveryInfo.period}</span> 期发货，预计于{' '}
        <span className="orange">{multiPeriodDeliveryInfo.delivery_time}</span> 送达）
      </span>
    </div>
  );
};

export default Title;
