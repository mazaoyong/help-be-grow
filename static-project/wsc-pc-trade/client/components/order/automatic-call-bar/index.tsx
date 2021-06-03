/* eslint-disable @youzan/wsc-pc/no-interval */
import React, { Component } from 'react';
import { LayoutRow as Row, LayoutCol as Col, Button } from 'zent';
import formatDate from '@youzan/utils/date/formatDate';
import cx from 'classnames';
import './index.scss';

function getTimeStr(time: number) {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss');
}

interface IProps {
  autoCallInfo: {
    appointedDeliveryTime?: number;
  };
  onCancel: () => void;
}

interface IState {
  delayTime: number;
  autoCallFormatTime: string;
  isShowWaitingDesc: boolean;
}

export default class AutomaticCallBar extends Component<IProps, IState> {
  timerID: number | null;
  static defaultProps = {
    autoCallInfo: {
      appointedDeliveryTime: new Date().getTime(),
    },
  };

  constructor(props) {
    super(props);
    this.timerID = null;

    const delayTime = props.autoCallInfo.appointedDeliveryTime;
    const isOverAutoCallTime = delayTime <= 0;
    this.state = {
      delayTime,
      autoCallFormatTime: '',
      isShowWaitingDesc: isOverAutoCallTime,
    };
  }

  componentDidMount() {
    const delayTime = this.state.delayTime;
    this.setState({
      autoCallFormatTime: getTimeStr(delayTime),
    });
  }

  confirmCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { isShowWaitingDesc, autoCallFormatTime } = this.state;
    return (
      <div className="automatic-call-bar">
        <Row className="automatic-call-bar__row">
          <Col className={cx('automatic-call-bar-text')} span={12}>
            <span className="automatic-call-bar-icon" />
            <span className="automatic-call-bar-desc">
              已开启自动呼叫，系统将在 {autoCallFormatTime} 自动呼叫配送员
            </span>
            {!isShowWaitingDesc && (
              <Button className="automatic-call-bar__action-btn" onClick={this.confirmCancel}>
                取消
              </Button>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
