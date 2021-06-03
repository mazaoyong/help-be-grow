import React from 'react';
import { Radio, Pop, Icon } from 'zent';
import { Form } from '@zent/compat';
import { DELIVERY_MODE, EXPRESS_TYPES, WEIXIN_DELIVERY_HELPER } from './const';
import { OrderContext } from './order-context';
import { isKuaishouOrder, isWeixinOrder } from './utils';
import { BlankLink } from '@youzan/react-components';
import api from './api';
const { FormRadioGroupField } = Form;

interface IProps {
  type: string;
  deliveryType: number;
  noNeedToDeliver?: boolean;
  isExchange: boolean;
  isMultiPeriod: boolean;
  onChange: (type: number) => void;
}

interface IState {
  allowLocalExpress: boolean;
}

class DeliveryTypeSelection extends React.Component<IProps, IState> {
  static contextType = OrderContext;

  constructor(props: IProps) {
    super(props);
    this.state = { allowLocalExpress: false };
  }

  componentDidMount() {
    const { type } = this.props;
    if (type === 'intracity') {
      api.isAllowLocalExpress().then(allowLocalExpress => this.setState({ allowLocalExpress }));
    }
  }

  render() {
    const { orderInfo } = this.context;
    const { type, deliveryType, noNeedToDeliver, isExchange, isMultiPeriod, onChange } = this.props;
    const { allowLocalExpress } = this.state;
    const expressType = EXPRESS_TYPES[type];
    let deliveryTypes = expressType.deliveryTypes;
    if (type === 'intracity' && noNeedToDeliver) {
      deliveryTypes = ['intraCityByMerchant'];
    }

    if (type === 'intracity' && (isKuaishouOrder(orderInfo) || allowLocalExpress)) {
      deliveryTypes = ['intraCityByMerchant', 'intraCityCall', 'expressByMerchant'];
    }

    if (type === 'selfPick' && isExchange) {
      // 自提订单 换货情况下，仍使用之前的发货方式
      deliveryTypes = ['expressByMerchant', 'withoutExpress'];
    }

    // 换货情况下 禁选 在线下单、呼叫三方配送
    if (isExchange) {
      deliveryTypes = deliveryTypes.filter(
        item => ['intraCityCall', 'expressOnDoor'].indexOf(item) === -1,
      );
    }

    const weixinHelpPop = (
      <Pop
        trigger="hover"
        content={
          <div style={{ width: 280 }}>
            <ul>
              <li>· 支持市面主流快递公司在线下单；</li>
              <li>· 接入微信官方物流通知，帮助消费者快速找到订单，还能提升15%店铺回流；</li>
            </ul>
            <BlankLink href={WEIXIN_DELIVERY_HELPER}>立即使用</BlankLink>
          </div>
        }
        position="top-center"
      >
        <Icon style={{ color: '#c8c9cc', marginLeft: 5, fontSize: 16 }} type="help-circle" />
      </Pop>
    );

    const weixinTipPop = children => (
      <Pop
        trigger="hover"
        position="top-center"
        content={
          <div style={{ width: 280 }}>
            目前仅支持微信小程序订单使用，更多渠道订单正在接入中，敬请期待…
          </div>
        }
      >
        {children}
      </Pop>
    );
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
          } else if (key === 'weixinDelivery') {
            const enable = isWeixinOrder(orderInfo) && !isMultiPeriod;
            const content = DELIVERY_MODE[key].text;
            return (
              <Radio disabled={!enable} key={key} value={DELIVERY_MODE[key].value}>
                {enable ? content : weixinTipPop(content)}
                {weixinHelpPop}
              </Radio>
            );
          } else if (key === 'withoutExpress') {
            return (
              <Radio key={key} value={DELIVERY_MODE[key].value}>
                <Pop
                  trigger="hover"
                  position="top-left"
                  content="选择无需物流后无法更改发货方式，请慎重选择。"
                >
                  {DELIVERY_MODE[key].text}
                </Pop>
              </Radio>
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
