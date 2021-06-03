import React from 'react';
import { Radio, Pop } from 'zent';
import { Form } from '@zent/compat';
import { DELIVERY_MODE, EXPRESS_TYPES } from './const';
import { OrderContext } from './order-context';
import { isKuaishouOrder } from './utils';
const { FormRadioGroupField } = Form;

interface IProps {
  type: string;
  deliveryType: number;
  noNeedToDeliver?: boolean;
  onChange: (type: number) => void;
}

class DeliveryTypeSelection extends React.Component<IProps> {
  static contextType = OrderContext;

  render() {
    const { orderInfo } = this.context;
    const { type, deliveryType, onChange } = this.props;
    const expressType = EXPRESS_TYPES[type];
    let deliveryTypes = expressType.deliveryTypes;
    if (type === 'intracity') {
      deliveryTypes = ['intraCityByMerchant'];
    }
    return (
      <FormRadioGroupField
        className="delivery-type-group"
        name="deliveryType"
        label="发货方式"
        onChange={e => onChange(+e.target.value)}
        value={deliveryType}
      >
        {deliveryTypes.map(key => {
          if (
            isKuaishouOrder(orderInfo) &&
            (key === 'withoutExpress' || key === 'intraCityByMerchant')
          ) {
            return (
              <Radio disabled key={key} value={DELIVERY_MODE[key].value}>
                <Pop
                  trigger="hover"
                  position="top-center"
                  content="为保障快手订单及时结算，请选择其他发货方式"
                >
                  {DELIVERY_MODE[key].text}
                </Pop>
              </Radio>
            );
          } else if (key === 'withoutExpress') {
            return (
              <Pop
                trigger="hover"
                position="top-left"
                content="选择无需物流后无法更改发货方式，请慎重选择。"
              >
                <Radio key={key} value={DELIVERY_MODE[key].value}>
                  {DELIVERY_MODE[key].text}
                </Radio>
              </Pop>
            );
          } else {
            return (
              <Radio key={key} value={DELIVERY_MODE[key].value}>
                {DELIVERY_MODE[key].text}
              </Radio>
            );
          }
        })}
      </FormRadioGroupField>
    );
  }
}

export default DeliveryTypeSelection;
