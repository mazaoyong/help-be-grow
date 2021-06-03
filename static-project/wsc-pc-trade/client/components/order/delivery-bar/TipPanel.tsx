import React, { Component } from 'react';
import { Button, Notify } from 'zent';
import cx from 'classnames';
import noop from 'lodash/noop';
import map from 'lodash/map';
import api from './api';
import { IDeliveryListItem } from 'definitions/order/list';

interface IProps {
  close: () => void;
  callback: () => void;
  deliveryInfo: Pick<IDeliveryListItem, 'packId'>;
  orderNo: string;
  tips: number[];
}

interface IState {
  value: number;
  submiting: boolean;
}

export default class TipPanel extends Component<IProps, IState> {
  static defaultProps = {
    close: noop,
    callback: noop,
    deliveryInfo: {},
    tips: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 2,
      submiting: false,
    };
  }

  handleValueChange = (value: number) => {
    this.setState({
      value,
    });
  };

  handleConfirm = () => {
    if (!this.state.value) {
      return Notify.error('小费不能为空!');
    }
    this.handleAddTip(this.state.value);
  };

  handleAddTip = (tips: number) => {
    this.setState({ submiting: true });
    api
      .addTip({
        packId: this.props.deliveryInfo.packId,
        orderNo: this.props.orderNo,
        tips,
      })
      .then(() => {
        this.props.callback();
        this.props.close();
      })
      .catch(msg => Notify.error(msg))
      .finally(() => {
        this.setState({ submiting: false });
      });
  };

  render() {
    const { tips } = this.props;

    return (
      <div className="order-delivery-bar__tip">
        <div>小费只能加一次喔</div>
        <div className="price-content">
          {map(tips, (tip, idx) => (
            <Button
              key={idx}
              onClick={() => this.handleValueChange(tip)}
              className={cx({ 'is-selected': this.state.value === tip })}
            >
              {(tip / 100).toFixed(2)}元
            </Button>
          ))}
        </div>
        <div className="order-delivery-bar__tip-action">
          <Button type="primary" loading={this.state.submiting} onClick={this.handleConfirm}>
            确定
          </Button>
          <Button onClick={this.props.close}>取消</Button>
        </div>
      </div>
    );
  }
}
