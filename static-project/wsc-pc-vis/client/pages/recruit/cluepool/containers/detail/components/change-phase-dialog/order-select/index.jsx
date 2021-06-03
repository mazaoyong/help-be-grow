import React from 'react';
import format from '@youzan/utils/money/format';
import { BlankLink } from '@youzan/react-components';
import { Dialog } from '@youzan/ebiz-components';
import SelectOrderDialog from '../../select-order-dialog';
import { isEduHqStore } from '@youzan/utils-shop';

import './style.scss';
const { openDialog } = Dialog;

class OrderSelect extends React.PureComponent {
  static defaultProps = {
    lessonName: null,
    orderNo: null,
    totalPay: 0,
    bookTime: 0,
    show: true,
    clueId: null,
  };

  state = {
    dialogState: null,
  };

  get selected() {
    return this.props.orderNo !== null;
  }

  onSelect = () => {
    const { clueId } = this.props;

    const dialogRef = openDialog(SelectOrderDialog, {
      dialogId: 'phase-select-order-dialog',
      title: '选择订单',
      style: {
        width: '936px',
      },
      data: {
        clueId,
        state: this.state.dialogState,
      },
    });

    dialogRef.afterClosed().then(data => {
      if (!data) return;
      const { order, state } = data;
      this.props.onOrderChange(order);
      this.setState({ dialogState: state });
    });
  };

  getOrderLink = orderNo => {
    return (
      <BlankLink href={`${window._global.url.www}/trade/order/detail?order_no=${orderNo}`}>
        {orderNo}
      </BlankLink>
    );
  };

  render() {
    const { selected, onSelect, getOrderLink } = this;
    const { lessonName, orderNo, totalPay, bookTime, show, campusShopName } = this.props;
    if (!show) return null;

    return (
      <div className="edu__clue-detail-order-select-field zent-form__control-group">
        <label className="zent-form__control-label">成交订单：</label>
        <div className="zent-form__controls">
          <p>
            <a href="javascript:;" onClick={onSelect}>
              {selected ? '重新选择' : '选择订单'}
            </a>
          </p>
          {selected && (
            <div className="summary">
              <div className="title">{lessonName}</div>
              <div className="order-no">订单编号：{getOrderLink(orderNo)}</div>
              <div className="total-pay">订单金额：￥{format(totalPay)}</div>
              <div className="book-time">下单时间：{bookTime}</div>
              {
                isEduHqStore && <div className="campus-name">所属校区：{campusShopName}</div>
              }
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OrderSelect;
