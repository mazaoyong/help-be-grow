import React, { Component } from 'react';
import { Notify, Icon } from 'zent';
import { updateReserve } from '../../api/reserve';
import { RESERVE_STATUS_TEXT, RESERVE_STATUS } from '../../constants';
import { deleteEmptyProperty } from '../../utils';

export default class PopStatusSelect extends Component {
  changeStatus = reserveStatus => {
    const { appointmentTime, courseAlias, status, id, studentAlias } = this.props.reserve;
    if (reserveStatus === status) return;
    if (reserveStatus === RESERVE_STATUS.NOT_CLASS || reserveStatus === RESERVE_STATUS.CLASSED) {
      if (!(appointmentTime && courseAlias)) {
        return Notify.error('该条记录还存在未完善的必要信息，请完善后再更改状态');
      }
    }

    if (+appointmentTime > Date.now()) {
      // 待确认/待上课改成已上课需要限制
      if (
        reserveStatus === RESERVE_STATUS.CLASSED &&
        (status === RESERVE_STATUS.NOT_CONFIRMED || status === RESERVE_STATUS.NOT_CLASS)
      ) {
        return Notify.error('该预约还没到上课时间，无法修改为已上课状态');
      }
    }

    updateReserve(deleteEmptyProperty({ id, status: reserveStatus, studentAlias }))
      .then(data => {
        const { updateReserveData } = this.props;
        Notify.success('状态修改成功');
        updateReserveData && updateReserveData();
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        // todo
      });
  };
  render() {
    const { status } = this.props.reserve;
    return (
      <div className="pop-status">
        {RESERVE_STATUS_TEXT.map((item, index) => {
          return (
            <div
              className="pop-status__item"
              key={index}
              onClick={() => this.changeStatus(item.status)}
            >
              {item.text}
              {status === item.status && <Icon className="pop-status__icon" type="check" />}
            </div>
          );
        })}
      </div>
    );
  }
}
