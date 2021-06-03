import React from 'react';
import ExpressSelection from './ExpressSelection';
import { getDefaultExpressId, setDefaultExpressId } from '../utils';
import WrapperWithFooter from './WrapperWithFooter';
import { IModel, IDeliveryInfo } from '../type';

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
  expressId: number | '';
  expressName: string;
  expressNo: string;
}

/**
 * 自提订单
 *
 * @class SelfPickup
 * @extends {React.Component}
 */
class SelfPickup extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      expressId: getDefaultExpressId(),
      expressName: '',
      expressNo: '',
    };
  }

  handleSubmit = () => {
    const { onSubmit, deliveryType } = this.props;
    const { expressId, expressName, expressNo } = this.state;
    let express = {};
    if (deliveryType === 12) {
      express = {
        expressId,
        expressName,
        expressNo,
      };
      setDefaultExpressId(expressId);
    }

    onSubmit &&
      onSubmit({
        express,
        deliveryType,
      });
  };

  handleValueChange = (key: string, val: any) => {
    // @ts-ignore
    this.setState({
      [key]: val,
    });
  };

  // 普通快递发货
  renderExpress() {
    const { expressId, expressName, expressNo } = this.state;
    return (
      <div className="delivery-content">
        <ExpressSelection
          expressId={expressId}
          expressName={expressName}
          expressNo={expressNo}
          onChange={this.handleValueChange}
        />
        <div className="gray">
          *请仔细填写物流公司及快递单号，发货后72小时内仅支持做一次更正，逾期不可修改
        </div>
      </div>
    );
  }

  render() {
    const { deliveryType, submitting, handleSubmit } = this.props;
    let content: React.ReactNode = null;
    if (deliveryType === 12) {
      content = this.renderExpress();
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

export default SelfPickup;
