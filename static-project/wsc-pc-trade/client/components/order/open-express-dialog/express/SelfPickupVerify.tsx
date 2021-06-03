import React from 'react';
import { Alert } from 'zent';
import { Form } from '@zent/compat';
import WrapperWithFooter from './WrapperWithFooter';
import { IModel, IDeliveryInfo } from '../type';

const { FormInputField } = Form;

interface IProps {
  deliveryType: number;
  model: IModel;
  orderNo: string;
  zentForm: any;
  handleSubmit: any;
  onSubmit: (deliveryInfo: IDeliveryInfo) => void;
  submitting: boolean;
}

interface IState {
  selfFetchNo: string;
}

/**
 * 自提订单
 *
 * @class SelfPickup
 * @extends {React.Component}
 */
class SelfPickupVerify extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      selfFetchNo: '',
    };
  }

  handleSubmit = () => {
    const { onSubmit, deliveryType } = this.props;
    const { selfFetchNo } = this.state;
    const deliveryInfo: IDeliveryInfo = { deliveryType, selfFetchInfo: { selfFetchNo } };
    onSubmit && onSubmit(deliveryInfo);
  };

  handleValueChange = selfFetchNo => {
    this.setState({ selfFetchNo });
  };

  // 输入自提码
  renderSelfFetchCode() {
    const { selfFetchNo } = this.state;
    return (
      <div className="delivery-content self-fetch-content">
        <FormInputField
          onChange={e => this.handleValueChange(e.target.value.trim())}
          name="selfFetchNo"
          label="提货码："
          width={184}
          value={selfFetchNo}
          validations={{
            required: true,
            noEmpty(_, value) {
              return value.trim() !== '';
            },
          }}
          validationErrors={{
            required: '请填写自提码',
            noEmpty: '请填写正确的自提码',
          }}
        />
      </div>
    );
  }

  render() {
    const { deliveryType, submitting, handleSubmit } = this.props;
    let content: React.ReactNode = null;
    if (deliveryType === 1) {
      content = this.renderSelfFetchCode();
    } else if (deliveryType === 2) {
      content = <Alert type="info">请仔细核对联系人信息，避免冒领或者错误核销造成损失！</Alert>;
    }
    return (
      <WrapperWithFooter
        onSubmit={this.handleSubmit}
        loading={submitting}
        handleSubmit={handleSubmit}
      >
        {content}
      </WrapperWithFooter>
    );
  }
}

export default SelfPickupVerify;
