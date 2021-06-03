import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Notify, Button, Sweetalert } from 'zent';
import ajax from 'zan-pc-ajax';

export default class TicketButton extends PureComponent {
  static propTypes = {
    orderNo: PropTypes.string,
    type: PropTypes.string,
    callback: PropTypes.func,
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  // 电子卡券：出票
  handleTicket = () => {
    this.setState({
      submiting: true,
    });
    return ajax({
      url: `${window._global.url.base}/v4/trade/order/ticket.json`,
      method: 'POST',
      // 新接口请使用 contentType: 'application/json'
      contentType: 'application/x-www-form-urlencoded',
      data: {
        orderNo: this.props.orderNo,
      },
    })
      .then(() => {
        this.setState({
          show: false,
        });
        this.props.callback();
        Notify.success('出票成功');
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          submiting: false,
        });
      });
  };

  showDialog = () => {
    Sweetalert.confirm({
      title: '确认出票',
      content: (
        <p>出票后不会给消费者发送券码，请确保已在第三方应用系统人工出票，避免消费者客诉。</p>
      ),
      onConfirm: this.handleTicket,
    });
  };

  render() {
    if (!this.state.show) {
      return null;
    }
    return (
      <div style={{ margin: '5px 0' }}>
        <Button
          size="small"
          loading={this.state.submiting}
          onClick={this.showDialog}
          type={this.props.type}
          disabled={this.props.disabled}
        >
          出&nbsp;&nbsp;票
        </Button>
      </div>
    );
  }
}
