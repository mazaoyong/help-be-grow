import React, { Component } from 'react';
import { RESERVE_STATUS_MAP } from '../../../../constants';
import classnames from 'classnames';

const CLASS_NAME_MAP = {
  1: 'reserve-status-item__dot-not-confirmed',
  2: 'reserve-status-item__dot-not-class',
  4: 'reserve-status-item__dot-classed',
  6: 'reserve-status-item__dot-ruancy',
  7: 'reserve-status-item__dot-leave',
  5: 'reserve-status-item__dot-cancel',
};

export default class ReserveStatusItem extends Component {
  render() {
    const { status } = this.props;
    const itemClass = classnames({
      'reserve-status-item__dot': true,
      [CLASS_NAME_MAP[status]]: true,
    });
    return (
      <div className="reserve-status-item">
        <span className={itemClass} />
        {RESERVE_STATUS_MAP[status]}
      </div>
    );
  }
}
