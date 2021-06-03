import React, { Component } from 'react';
import { LayoutRow as Row, LayoutCol as Col, Button, Pop, Notify, Dialog } from 'zent';
import cx from 'classnames';
import api from './api';
import TipPanel from './TipPanel';
import DeliveryDetail from './DeliveryDetail';
import openCancelDialog from './open-cancel-dialog';
import { IDeliveryListItem, IGetTipsResponse } from 'definitions/order/list';

import './index.scss';

const { openDialog } = Dialog;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface IProps {
  deliveryInfo: IDeliveryListItem;
  orderNo: string;
  callback: () => void;
  tips: IGetTipsResponse;
}

interface IState {
  addTipPopShow: boolean;
  recallLoading: boolean;
}

class DeliveryBar extends Component<IProps, IState> {
  static defaultProps = {
    deliveryInfo: {},
    tips: {},
    callback: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      addTipPopShow: false,
      recallLoading: false,
    };
  }

  // 重新呼叫
  handleRecall = () => {
    this.setState({ recallLoading: true });
    api
      .recallDelivery({
        packId: this.props.deliveryInfo.packId,
        orderNo: this.props.orderNo,
      })
      .then(() => {
        this.props.callback();
      })
      .catch(msg => Notify.error(msg))
      .finally(() => this.setState({ recallLoading: false }));
  };

  handleTriggerTipPanel = (val: boolean) => {
    this.setState({
      addTipPopShow: val,
    });
  };

  handleCancelClick = () => {
    const {
      packId,
      orderNo,
      appId,
      deliveryChannel,
      deliveryChannelName,
      deliveryDetail,
    } = this.props.deliveryInfo;
    openCancelDialog({
      packId,
      orderNo,
      appId,
      deliveryChannel,
      deliveryChannelName,
      callback: this.props.callback,
      stateCode: deliveryDetail?.stateCode,
    });
  };

  // 查看配送详情
  handleShowDetailDialog = () => {
    openDialog({
      title: '配送详情',
      children: (
        <DeliveryDetail packId={this.props.deliveryInfo.packId} orderNo={this.props.orderNo} />
      ),
      style: { width: '900px' },
    });
  };

  render() {
    const { deliveryInfo, tips } = this.props;
    const {
      appId,
      deliveryChannel,
      isNormalDeliveryState,
      deliveryText,
      isShowDetailBtn,
      isShowCancelBtn,
      isShowAddTipBtn,
      isShowRedeliveryBtn,
    } = deliveryInfo;
    let tip;
    let isSupportTip;
    if (appId) {
      tip = tips![appId] || {};
      isSupportTip = tip.isSupport;
    } else {
      const channelNames = { 1: 'dada', 2: 'fengniao', 3: 'dianwoda', 11: 'dadaselfsettle' };
      const name = channelNames[deliveryChannel];
      tip = tips![name] || {};
      isSupportTip = tip.isSupport;
    }

    return (
      <div className="order-delivery-bar">
        <Row className="order-delivery-bar__row">
          <Col
            className={cx('order-delivery-bar-text', {
              'order-delivery-bar-text__danger': !isNormalDeliveryState,
            })}
            span={10}
          >
            <span className="order-delivery-bar-icon" />
            {deliveryText}
            {isShowDetailBtn && (
              <a
                className="order-delivery-bar__operation"
                href="javascript:;"
                onClick={this.handleShowDetailDialog}
              >
                查看
              </a>
            )}
          </Col>
          <Col className="order-delivery-bar__action" span={12}>
            {isShowCancelBtn && (
              <Button onClick={this.handleCancelClick} className="order-delivery-bar__action-btn">
                取消
              </Button>
            )}
            {isShowAddTipBtn && isSupportTip && (
              <Pop
                trigger="click"
                position="top-right"
                visible={this.state.addTipPopShow}
                onVisibleChange={this.handleTriggerTipPanel}
                className="add-tip-pop"
                content={
                  <TipPanel
                    {...this.props}
                    tips={tip.tips}
                    callback={this.props.callback}
                    close={() => this.handleTriggerTipPanel(false)}
                  />
                }
              >
                <Button className="order-delivery-bar__action-btn">加小费</Button>
              </Pop>
            )}
            {deliveryInfo.tip && (
              <span>
                已加
                {deliveryInfo.tip / 100}
                元小费
              </span>
            )}
            {isShowRedeliveryBtn && (
              <Button
                onClick={this.handleRecall}
                loading={this.state.recallLoading}
                className="order-delivery-bar__action-btn"
              >
                重新呼叫
              </Button>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Object.assign(DeliveryBar, {
  TipPanel,
  DeliveryDetail,
  openCancelDialog,
});
